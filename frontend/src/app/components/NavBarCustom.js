"use client";
import Link from "next/link";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { readToken, removeToken } from "@/app/lib/authenticate";

import { useAtom } from "jotai";
import { favoritesAtom } from "./RecipesSearch";

export default function NavBarCustom() {
  const [favorites] = useAtom(favoritesAtom);
  let token = readToken();

  function logout() {
    removeToken();

    window.location.href = "/";
  }

  return (
    <Navbar expand="lg">
      <div className="container-fluid">
        <Navbar.Brand as={Link} href="/">
          HUSE | Recipes
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          {token && (
            <NavDropdown
              title="Favorite"
              id="basic-nav-dropdown"
              className="me-auto"
            >
              {favorites.length > 0 ? (
                favorites.map((favorite, index) => (
                  <NavDropdown.Item
                    as={Link}
                    key={index}
                    href={`/favorite/${favorite.recipeLabel
                      .toLowerCase()
                      .replaceAll(" ", "-")}`}
                  >
                    {favorite.recipeLabel}
                  </NavDropdown.Item>
                ))
              ) : (
                <span className="p-2">No history</span>
              )}
            </NavDropdown>
          )}
          <Nav className="ml-auto">
            {!token && (
              <>
                <Link href="/login" passHref legacyBehavior>
                  <Nav.Link>Login</Nav.Link>
                </Link>

                <Link href="/register" passHref legacyBehavior>
                  <Nav.Link>Register</Nav.Link>
                </Link>
              </>
            )}

            {token && <Nav.Link onClick={logout}>Logout</Nav.Link>}
          </Nav>
        </Navbar.Collapse>
      </div>
    </Navbar>
  );
}
