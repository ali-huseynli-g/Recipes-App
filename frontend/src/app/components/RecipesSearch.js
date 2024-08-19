"use client";
import { useEffect, useState } from "react";
import { atom, useAtom } from "jotai";

import RecipesPagination from "./Pagination";
import { readToken } from "../lib/authenticate";
export const errorMessageAtom = atom(null);
export const favoritesAtom = atom([]);

const mockRecipe = {
  label: "Easter lamb soup with dolma",
  images: {
    THUMBNAIL: {
      url: "https://edamam-product-images.s3.amazonaws.com/web-img/6b3/6b3fad24024ec7b15636efe11746cdb9-s.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEQaCXVzLWVhc3QtMSJHMEUCICBt2Y7cC4X0txMMZCaCMq0eNkGKbOJdnzMnek1tfxUMAiEA5ObkGxDEg2RodX46EIbZkQRS5Xvl69aVbOFLyhX3ONkquAUIPRAAGgwxODcwMTcxNTA5ODYiDKHn4xeS06YC7FGAgyqVBQ1HadflSXo6oZJ2SkKsDuUBk1lFQwf5uyhTyY8JcHj6TBnIp8k5Oy63ieiVb2CLfdPvzwGjCyfVagrBdHCaqhaZS3uzjL2bJBwTGaXwKqNPfPT%2Be9GOKmiFZ1ItuKF04SdqNycyyniKc8XOGP8xo0V6PIOncqJccgTGNn6%2FiVSc9ajrLUJIvB4qsHUUUIgUXs7Fff8eeVfQYNTgqPqpPqHslcwf8V08cVzCo1MYvC7zckn%2BRHhCsfj3wNwPZ26Gges3%2BgCP2wmmSLrEE5F6RFMZimky1V%2Fw7guHAmADM3uHtTQDv%2F%2Bf%2B5w7sINHlkbU1Lyycw73gkERFV9E9zAXNUekmVJLM1b7oYNbF%2BXxsf6KP7r3qT4hpbumQ6OBKqPysRZnpwVBmD%2FsURCF16Z4vvrLRZnXgBbFSEaD0KM1OLgIa6x9x3cgkd4AuNLwZJ%2FivCXKd4jOi5uEVm1xbnKpqYPwxA6xB1zCLhkAEDI7Hcxb372qEQQKUP6OD2T9y0NfjJ09iwNJDuM0bjI%2FA2mvxXF8cb0Lc5pPCXGnxq6GDBjeoGJxU3zhIrwRen1LDJMiYd1H32t%2B%2BvISHEMfcVJdopyn5Kw7AZQW57ZqCrRbqhwItat0l3b66pxgkeXI8gkwdtWyvSbEZ%2F4ngqDtwI%2FzVRm%2Bdxx7TlkN%2BPvhXIm0r36l%2FENnTZXADkNnNPo4bJdhgvJ9nyfYQq%2BblgAtYPdFtNK3UXmwi3rtMTi10ZucJQ6ys%2FKspbg7Y8bHAd%2FUq8izR29WRmh1qUXaG2AVAwdspe2thQ9Y3n0flNQnuetsE%2BOIlanFt20MqjxByWvAUkhOQdVw4rRJQI6bXWHlSxZUv0ucTzmViO%2BOctSI2dbfHEG%2F5bj6sRMwlpfWtQY6sQGSBzjkJQvTKIL8hySlpOrt6Vlw9IZHX6WIk7TL22fo9NHgacHDxNIVyJGAkuncJCPvVD1LxoAIfAguu4YYMzDTJYvAvLOoXBGKPZ5iKw4o0nuEO4dCf4HpvX9qBWRDFawXfkqGRSL%2FRTodsKj%2Flqlfu8gNkpdHz96CnTHpc367%2F%2Fz7lfaPBz6iga%2Fkwy89Nm9mLYNvw8khgt%2B0h0jIGWTZtWwKgaeAev9Loy3HpeTjhl0%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240809T034555Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFCI5XVMYT%2F20240809%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=218dc3821ce69b7349782cc8c6aef8eb8e42353e8b5e16d2f111ec87fe64570e",
      width: 100,
      height: 100,
    },
    SMALL: {
      url: "https://edamam-product-images.s3.amazonaws.com/web-img/6b3/6b3fad24024ec7b15636efe11746cdb9-m.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEQaCXVzLWVhc3QtMSJHMEUCICBt2Y7cC4X0txMMZCaCMq0eNkGKbOJdnzMnek1tfxUMAiEA5ObkGxDEg2RodX46EIbZkQRS5Xvl69aVbOFLyhX3ONkquAUIPRAAGgwxODcwMTcxNTA5ODYiDKHn4xeS06YC7FGAgyqVBQ1HadflSXo6oZJ2SkKsDuUBk1lFQwf5uyhTyY8JcHj6TBnIp8k5Oy63ieiVb2CLfdPvzwGjCyfVagrBdHCaqhaZS3uzjL2bJBwTGaXwKqNPfPT%2Be9GOKmiFZ1ItuKF04SdqNycyyniKc8XOGP8xo0V6PIOncqJccgTGNn6%2FiVSc9ajrLUJIvB4qsHUUUIgUXs7Fff8eeVfQYNTgqPqpPqHslcwf8V08cVzCo1MYvC7zckn%2BRHhCsfj3wNwPZ26Gges3%2BgCP2wmmSLrEE5F6RFMZimky1V%2Fw7guHAmADM3uHtTQDv%2F%2Bf%2B5w7sINHlkbU1Lyycw73gkERFV9E9zAXNUekmVJLM1b7oYNbF%2BXxsf6KP7r3qT4hpbumQ6OBKqPysRZnpwVBmD%2FsURCF16Z4vvrLRZnXgBbFSEaD0KM1OLgIa6x9x3cgkd4AuNLwZJ%2FivCXKd4jOi5uEVm1xbnKpqYPwxA6xB1zCLhkAEDI7Hcxb372qEQQKUP6OD2T9y0NfjJ09iwNJDuM0bjI%2FA2mvxXF8cb0Lc5pPCXGnxq6GDBjeoGJxU3zhIrwRen1LDJMiYd1H32t%2B%2BvISHEMfcVJdopyn5Kw7AZQW57ZqCrRbqhwItat0l3b66pxgkeXI8gkwdtWyvSbEZ%2F4ngqDtwI%2FzVRm%2Bdxx7TlkN%2BPvhXIm0r36l%2FENnTZXADkNnNPo4bJdhgvJ9nyfYQq%2BblgAtYPdFtNK3UXmwi3rtMTi10ZucJQ6ys%2FKspbg7Y8bHAd%2FUq8izR29WRmh1qUXaG2AVAwdspe2thQ9Y3n0flNQnuetsE%2BOIlanFt20MqjxByWvAUkhOQdVw4rRJQI6bXWHlSxZUv0ucTzmViO%2BOctSI2dbfHEG%2F5bj6sRMwlpfWtQY6sQGSBzjkJQvTKIL8hySlpOrt6Vlw9IZHX6WIk7TL22fo9NHgacHDxNIVyJGAkuncJCPvVD1LxoAIfAguu4YYMzDTJYvAvLOoXBGKPZ5iKw4o0nuEO4dCf4HpvX9qBWRDFawXfkqGRSL%2FRTodsKj%2Flqlfu8gNkpdHz96CnTHpc367%2F%2Fz7lfaPBz6iga%2Fkwy89Nm9mLYNvw8khgt%2B0h0jIGWTZtWwKgaeAev9Loy3HpeTjhl0%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240809T034555Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFCI5XVMYT%2F20240809%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=670013fa1558a214a809b86d7a659c903490a22b5a8262e33d9779ac322d067b",
      width: 200,
      height: 200,
    },
    REGULAR: {
      url: "https://edamam-product-images.s3.amazonaws.com/web-img/6b3/6b3fad24024ec7b15636efe11746cdb9.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEcaCXVzLWVhc3QtMSJGMEQCIBPsZH1ICf5t12m%2BnUzTMJu1kuzu5huuumGZIwMsn%2FjKAiAZwM2bC0XB%2FQnrLZ6IJklXL3bUsCzJIxBzg0NO70Iaoyq4BQhAEAAaDDE4NzAxNzE1MDk4NiIMzTYn5KlJXulli1bSKpUFBNsLbrICED1wT4%2FhWfpCF8BCtq1zDvw52lgW10TUz03P22VZNc%2Fehou2uFxeBr8DlZRiWjZO5Wg8VpJEdaNXRsXDUtyIVDArDfBt5qRnwzsNfBUuDB2JNms7m4EYLDixZX3fEnKSzgrg%2BqWGV9F7QmKI6It4IFpmHTB9XGIeHtyXATRZs2R9wpWYUm1Do03m6k1NhyVZG1eFG9GrKXCJPAHVv7oFQ4MiyvU7Gb7265yX0oR2DeqhSZt8NFOnrinOyoBtyy%2F35mfLQX9iUQDd6AAsVf2t4lJZrEn4SBoNKAYITgzFkCgch2SGSKhlyV0m2TkG2QnanKu1u5PB%2BByxH3hQzDZO4BlZB5MCo%2Bw%2FPYBD7BQl43HqCSJcut3ulLsGRtE5g0%2BQdeTpxUU6PGPRa2YfB9m03juerAXITmJIiravS15HEJ3GaBlbnxXo%2B5ZVAh7FsN1h9cKVDJ63iEPaaDXStSgjeMXpfTkyizj5Hp5VVst46FaerLNQaE%2B99RQFfubM6A1DFwfCPAyZaNyoVxc1zSoGMsnKIhPDUkEqb5k37vQYepUYjh94tb%2B9hXcsRjaQbSm2oFHNxtasy9U%2F27ag%2F2I9ZXCg9yKsnFyO2ITF5CMPjVVRJD3616VU7%2FLmXixDtnsH9BE1a%2By21cHXRDZ581L8SG4TnWcj68BjOr%2B3Z5VAPvZhmb%2FhFwGUEMhMoxuQV7tamgVa4Fwv%2BlmiAga%2BQdwJCTuDq9VA7rlV4cBwYzQkTPZuyM4gS%2Bk0CjFKb0T3VS6AErqvMr77vzW9rmidbV3P6oJPMtyAXG7wLnCpZln3COGGNxdRwFrqn%2BseJ22anC5o18n1bVJYoWrZz6RS9P%2F8teA6zbS7z8h%2F94w3l7DnWzDW7da1BjqyAdke1lqqYbeiQXbMreWQQVqDub9g2uaVM8B5IWufgjnN2Kpx2ZpgkbL3279NkWRMiuezNeUkk6C4ocgM0wbwXpxhita7FddiNs29DAq3o74CW7N6Y%2F18ngBohm7bnhxiU15Wl%2Bwb73bEsJZbRWjyE7kAG6rp%2FXH57lKbV%2BHySjb%2BAHX%2BjyrzWlmVAt592%2BHXfzwK0YJD6TbNoIb05oFf89OfiFAnsEui0rzTOrZePpbEKxs%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240809T065326Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFEL6GSLHS%2F20240809%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=f802bfd613394cebe76b62345595c47c5d9e4955a11ca81aac121500fe64f22c",
      width: 300,
      height: 300,
    },
    LARGE: {
      url: "https://edamam-product-images.s3.amazonaws.com/web-img/6b3/6b3fad24024ec7b15636efe11746cdb9-l.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEQaCXVzLWVhc3QtMSJHMEUCICBt2Y7cC4X0txMMZCaCMq0eNkGKbOJdnzMnek1tfxUMAiEA5ObkGxDEg2RodX46EIbZkQRS5Xvl69aVbOFLyhX3ONkquAUIPRAAGgwxODcwMTcxNTA5ODYiDKHn4xeS06YC7FGAgyqVBQ1HadflSXo6oZJ2SkKsDuUBk1lFQwf5uyhTyY8JcHj6TBnIp8k5Oy63ieiVb2CLfdPvzwGjCyfVagrBdHCaqhaZS3uzjL2bJBwTGaXwKqNPfPT%2Be9GOKmiFZ1ItuKF04SdqNycyyniKc8XOGP8xo0V6PIOncqJccgTGNn6%2FiVSc9ajrLUJIvB4qsHUUUIgUXs7Fff8eeVfQYNTgqPqpPqHslcwf8V08cVzCo1MYvC7zckn%2BRHhCsfj3wNwPZ26Gges3%2BgCP2wmmSLrEE5F6RFMZimky1V%2Fw7guHAmADM3uHtTQDv%2F%2Bf%2B5w7sINHlkbU1Lyycw73gkERFV9E9zAXNUekmVJLM1b7oYNbF%2BXxsf6KP7r3qT4hpbumQ6OBKqPysRZnpwVBmD%2FsURCF16Z4vvrLRZnXgBbFSEaD0KM1OLgIa6x9x3cgkd4AuNLwZJ%2FivCXKd4jOi5uEVm1xbnKpqYPwxA6xB1zCLhkAEDI7Hcxb372qEQQKUP6OD2T9y0NfjJ09iwNJDuM0bjI%2FA2mvxXF8cb0Lc5pPCXGnxq6GDBjeoGJxU3zhIrwRen1LDJMiYd1H32t%2B%2BvISHEMfcVJdopyn5Kw7AZQW57ZqCrRbqhwItat0l3b66pxgkeXI8gkwdtWyvSbEZ%2F4ngqDtwI%2FzVRm%2Bdxx7TlkN%2BPvhXIm0r36l%2FENnTZXADkNnNPo4bJdhgvJ9nyfYQq%2BblgAtYPdFtNK3UXmwi3rtMTi10ZucJQ6ys%2FKspbg7Y8bHAd%2FUq8izR29WRmh1qUXaG2AVAwdspe2thQ9Y3n0flNQnuetsE%2BOIlanFt20MqjxByWvAUkhOQdVw4rRJQI6bXWHlSxZUv0ucTzmViO%2BOctSI2dbfHEG%2F5bj6sRMwlpfWtQY6sQGSBzjkJQvTKIL8hySlpOrt6Vlw9IZHX6WIk7TL22fo9NHgacHDxNIVyJGAkuncJCPvVD1LxoAIfAguu4YYMzDTJYvAvLOoXBGKPZ5iKw4o0nuEO4dCf4HpvX9qBWRDFawXfkqGRSL%2FRTodsKj%2Flqlfu8gNkpdHz96CnTHpc367%2F%2Fz7lfaPBz6iga%2Fkwy89Nm9mLYNvw8khgt%2B0h0jIGWTZtWwKgaeAev9Loy3HpeTjhl0%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240809T034555Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFCI5XVMYT%2F20240809%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=0c1ffcd8ab6c0ea4fe18fb66e37275582ebca15e950f1b47bf7cc64994321289",
      width: 600,
      height: 600,
    },
  },
  source: "BBC Good Food",
  url: "https://www.bbcgoodfood.com/recipes/easter-lamb-soup-with-dolma",
  shareAs:
    "http://www.edamam.com/recipe/easter-lamb-soup-with-dolma-3ab6d0193de44e8ca1997d7de44ddc06/dolma",
  yield: 8,
  dietLabels: ["Low-Carb", "Low-Sodium"],
  healthLabels: [
    "Sugar-Conscious",
    "Paleo",
    "Mediterranean",
    "Dairy-Free",
    "Gluten-Free",
    "Wheat-Free",
    "Peanut-Free",
    "Tree-Nut-Free",
    "Soy-Free",
    "Fish-Free",
    "Shellfish-Free",
    "Pork-Free",
    "Crustacean-Free",
    "Celery-Free",
    "Mustard-Free",
    "Sesame-Free",
    "Lupine-Free",
    "Mollusk-Free",
    "Kosher",
  ],
  cautions: ["Sulfites"],
  ingredientLines: [
    "50ml olive oil",
    "4 fresh bay leaves",
    "1 tsp dried oregano (wild oregano is best, available online)",
    "1 large white onion, finely chopped",
    "3 garlic cloves, finely chopped",
    "1 leek, finely sliced",
    "800g lamb shoulder, off the bone, cut into roughly 5cm cubes (ask your butcher for the bone)",
    "200ml white wine",
    "1 cos lettuce (about 500g), thinly sliced",
    "100g finely chopped parsley",
    "100g finely chopped mint",
    "250g finely chopped dill",
    "200g spinach, shredded",
    "2 large eggs",
    "3 lemons, juiced, plus wedges to serve",
    "chilli flakes, to serve (optional)",
  ],
  ingredients: [
    {
      text: "50ml olive oil",
      quantity: 50,
      measure: "milliliter",
      food: "olive oil",
      weight: 45.648930647488,
      foodCategory: "Oils",
      foodId: "food_b1d1icuad3iktrbqby0hiagafaz7",
      image:
        "https://www.edamam.com/food-img/4d6/4d651eaa8a353647746290c7a9b29d84.jpg",
    },
    {
      text: "4 fresh bay leaves",
      quantity: 4,
      measure: "\u003Cunit\u003E",
      food: "bay leaves",
      weight: 2.4,
      foodCategory: "Condiments and sauces",
      foodId: "food_asx39x4ayja4jab6ivj6zayvkblo",
      image:
        "https://www.edamam.com/food-img/0f9/0f9f5f95df173e9ffaaff2977bef88f3.jpg",
    },
    {
      text: "1 tsp dried oregano (wild oregano is best, available online)",
      quantity: 1,
      measure: "teaspoon",
      food: "dried oregano",
      weight: 1,
      foodCategory: "Condiments and sauces",
      foodId: "food_bkkw6v3bdf0sqiazmzyuiax7i8jr",
      image:
        "https://www.edamam.com/food-img/1b0/1b0eaffb1c261606e0d82fed8e9747a7.jpg",
    },
    {
      text: "1 large white onion, finely chopped",
      quantity: 1,
      measure: "\u003Cunit\u003E",
      food: "white onion",
      weight: 150,
      foodCategory: "vegetables",
      foodId: "food_bmrvi4ob4binw9a5m7l07amlfcoy",
      image:
        "https://www.edamam.com/food-img/205/205e6bf2399b85d34741892ef91cc603.jpg",
    },
    {
      text: "3 garlic cloves, finely chopped",
      quantity: 3,
      measure: "clove",
      food: "garlic",
      weight: 9,
      foodCategory: "vegetables",
      foodId: "food_avtcmx6bgjv1jvay6s6stan8dnyp",
      image:
        "https://www.edamam.com/food-img/6ee/6ee142951f48aaf94f4312409f8d133d.jpg",
    },
    {
      text: "1 leek, finely sliced",
      quantity: 1,
      measure: "\u003Cunit\u003E",
      food: "leek",
      weight: 89,
      foodCategory: "vegetables",
      foodId: "food_a27jevnb06c1m9ax7k41xbbcwcuo",
      image:
        "https://www.edamam.com/food-img/4ae/4ae9e09d029a28e0e2c64bdfdbf3f6ae.jpg",
    },
    {
      text: "800g lamb shoulder, off the bone, cut into roughly 5cm cubes (ask your butcher for the bone)",
      quantity: 800,
      measure: "gram",
      food: "lamb shoulder",
      weight: 800,
      foodCategory: "meats",
      foodId: "food_aubt242bs7x1shagh2ibkar7bckb",
      image:
        "https://www.edamam.com/food-img/35c/35cd09ea1665452ca64fccf9e32df4e9.jpg",
    },
    {
      text: "200ml white wine",
      quantity: 200,
      measure: "milliliter",
      food: "white wine",
      weight: 198.826453486837,
      foodCategory: "wines",
      foodId: "food_bn44h7baron9ufaoxinmya8l0yye",
      image:
        "https://www.edamam.com/food-img/a71/a718cf3c52add522128929f1f324d2ab.jpg",
    },
    {
      text: "1 cos lettuce (about 500g), thinly sliced",
      quantity: 500,
      measure: "gram",
      food: "lettuce",
      weight: 500,
      foodCategory: "vegetables",
      foodId: "food_bf5fxtkbc9alwoajuvsi7amonr5w",
      image:
        "https://www.edamam.com/food-img/719/71996625d0cb47e197093ecd52c97dc2.jpg",
    },
    {
      text: "100g finely chopped parsley",
      quantity: 100,
      measure: "gram",
      food: "parsley",
      weight: 100,
      foodCategory: "vegetables",
      foodId: "food_b244pqdazw24zobr5vqu2bf0uid8",
      image:
        "https://www.edamam.com/food-img/46a/46a132e96626d7989b4d6ed8c91f4da0.jpg",
    },
    {
      text: "100g finely chopped mint",
      quantity: 100,
      measure: "gram",
      food: "mint",
      weight: 100,
      foodCategory: "Condiments and sauces",
      foodId: "food_bxl4xoga4owdkeay51sy8anesxj5",
      image:
        "https://www.edamam.com/food-img/7f0/7f01cc4f71c5c6ad31051ed74b9c058b.jpg",
    },
    {
      text: "250g finely chopped dill",
      quantity: 250,
      measure: "gram",
      food: "dill",
      weight: 250,
      foodCategory: "Condiments and sauces",
      foodId: "food_avhhd2padkkzx8a9swnmlb1km3qb",
      image:
        "https://www.edamam.com/food-img/874/8740aacb8e1a348cd5eead1f0bb552d4.jpg",
    },
    {
      text: "200g spinach, shredded",
      quantity: 200,
      measure: "gram",
      food: "spinach",
      weight: 200,
      foodCategory: "vegetables",
      foodId: "food_aoceuc6bshdej1bbsdammbnj6l6o",
      image:
        "https://www.edamam.com/food-img/e6e/e6e4be375c4554ce01c8ea75232efaa6.jpg",
    },
    {
      text: "2 large eggs",
      quantity: 2,
      measure: "\u003Cunit\u003E",
      food: "eggs",
      weight: 100,
      foodCategory: "Eggs",
      foodId: "food_bhpradua77pk16aipcvzeayg732r",
      image:
        "https://www.edamam.com/food-img/a7e/a7ec7c337cb47c6550b3b118e357f077.jpg",
    },
    {
      text: "3 lemons, juiced, plus wedges to serve",
      quantity: 3,
      measure: "\u003Cunit\u003E",
      food: "lemons",
      weight: 252,
      foodCategory: "fruit",
      foodId: "food_a6uzc62astrxcgbtzyq59b6fncrr",
      image:
        "https://www.edamam.com/food-img/70a/70acba3d4c734d7c70ef4efeed85dc8f.jpg",
    },
    {
      text: "chilli flakes, to serve (optional)",
      quantity: 0,
      measure: null,
      food: "chilli flakes",
      weight: 0,
      foodCategory: "Condiments and sauces",
      foodId: "food_a8iooz3aris8gba605l07brngnrx",
      image:
        "https://www.edamam.com/food-img/374/3742b9434a0fb66a45e0dd6d227ba669.jpg",
    },
  ],
  calories: 3314.116238783,
  totalCO2Emissions: 33721.1779988209,
  co2EmissionsClass: "G",
  totalWeight: 2797.87538413433,
  totalTime: 80,
  cuisineType: ["mediterranean"],
  mealType: ["lunch/dinner"],
  dishType: ["soup"],
  totalNutrients: {
    ENERC_KCAL: {
      label: "Energy",
      quantity: 3314.116238783,
      unit: "kcal",
    },
    FAT: {
      label: "Fat",
      quantity: 233.734370647488,
      unit: "g",
    },
    FASAT: {
      label: "Saturated",
      quantity: 84.6509624293534,
      unit: "g",
    },
    FATRN: {
      label: "Trans",
      quantity: 0.038,
      unit: "g",
    },
    FAMS: {
      label: "Monounsaturated",
      quantity: 109.776609372666,
      unit: "g",
    },
    FAPU: {
      label: "Polyunsaturated",
      quantity: 22.3901277179862,
      unit: "g",
    },
    CHOCDF: {
      label: "Carbs",
      quantity: 109.292887790658,
      unit: "g",
    },
    "CHOCDF.net": {
      label: "Carbohydrates (net)",
      quantity: 73.0196877906578,
      unit: "g",
    },
    FIBTG: {
      label: "Fiber",
      quantity: 36.2732,
      unit: "g",
    },
    SUGAR: {
      label: "Sugars",
      quantity: 23.7086339534736,
      unit: "g",
    },
    PROCNT: {
      label: "Protein",
      quantity: 177.766218517441,
      unit: "g",
    },
    CHOLE: {
      label: "Cholesterol",
      quantity: 948,
      unit: "mg",
    },
    NA: {
      label: "Sodium",
      quantity: 1087.02630128729,
      unit: "mg",
    },
    CA: {
      label: "Calcium",
      quantity: 1591.68687012029,
      unit: "mg",
    },
    MG: {
      label: "Magnesium",
      quantity: 724.392645348684,
      unit: "mg",
    },
    K: {
      label: "Potassium",
      quantity: 7761.56927128213,
      unit: "mg",
    },
    FE: {
      label: "Iron",
      quantity: 64.3744654360404,
      unit: "mg",
    },
    ZN: {
      label: "Zinc",
      quantity: 40.0166917441842,
      unit: "mg",
    },
    P: {
      label: "Phosphorus",
      quantity: 2133.82076162763,
      unit: "mg",
    },
    VITA_RAE: {
      label: "Vitamin A",
      quantity: 3385.856,
      unit: "µg",
    },
    VITC: {
      label: "Vitamin C",
      quantity: 587.977,
      unit: "mg",
    },
    THIA: {
      label: "Thiamin (B1)",
      quantity: 1.84902732267434,
      unit: "mg",
    },
    RIBF: {
      label: "Riboflavin (B2)",
      quantity: 3.93010796802303,
      unit: "mg",
    },
    NIA: {
      label: "Niacin (B3)",
      quantity: 55.4610325697658,
      unit: "mg",
    },
    VITB6A: {
      label: "Vitamin B6",
      quantity: 3.46604322674342,
      unit: "mg",
    },
    FOLDFE: {
      label: "Folate equivalent (total)",
      quantity: 1611.22826453487,
      unit: "µg",
    },
    FOLFD: {
      label: "Folate (food)",
      quantity: 1611.22826453487,
      unit: "µg",
    },
    FOLAC: {
      label: "Folic acid",
      quantity: 0,
      unit: "µg",
    },
    VITB12: {
      label: "Vitamin B12",
      quantity: 21.13,
      unit: "µg",
    },
    VITD: {
      label: "Vitamin D",
      quantity: 2.8,
      unit: "µg",
    },
    TOCPHA: {
      label: "Vitamin E",
      quantity: 16.2764460132383,
      unit: "mg",
    },
    VITK1: {
      label: "Vitamin K",
      quantity: 3087.97896206374,
      unit: "µg",
    },
    WATER: {
      label: "Water",
      quantity: 2102.30404808006,
      unit: "g",
    },
  },
  totalDaily: {
    ENERC_KCAL: {
      label: "Energy",
      quantity: 165.70581193915,
      unit: "%",
    },
    FAT: {
      label: "Fat",
      quantity: 359.591339457674,
      unit: "%",
    },
    FASAT: {
      label: "Saturated",
      quantity: 423.254812146767,
      unit: "%",
    },
    CHOCDF: {
      label: "Carbs",
      quantity: 36.4309625968859,
      unit: "%",
    },
    FIBTG: {
      label: "Fiber",
      quantity: 145.0928,
      unit: "%",
    },
    PROCNT: {
      label: "Protein",
      quantity: 355.532437034882,
      unit: "%",
    },
    CHOLE: {
      label: "Cholesterol",
      quantity: 316,
      unit: "%",
    },
    NA: {
      label: "Sodium",
      quantity: 45.2927625536372,
      unit: "%",
    },
    CA: {
      label: "Calcium",
      quantity: 159.168687012029,
      unit: "%",
    },
    MG: {
      label: "Magnesium",
      quantity: 172.474439368734,
      unit: "%",
    },
    K: {
      label: "Potassium",
      quantity: 165.139771729407,
      unit: "%",
    },
    FE: {
      label: "Iron",
      quantity: 357.635919089113,
      unit: "%",
    },
    ZN: {
      label: "Zinc",
      quantity: 363.788106765311,
      unit: "%",
    },
    P: {
      label: "Phosphorus",
      quantity: 304.831537375376,
      unit: "%",
    },
    VITA_RAE: {
      label: "Vitamin A",
      quantity: 376.206222222222,
      unit: "%",
    },
    VITC: {
      label: "Vitamin C",
      quantity: 653.307777777778,
      unit: "%",
    },
    THIA: {
      label: "Thiamin (B1)",
      quantity: 154.085610222862,
      unit: "%",
    },
    RIBF: {
      label: "Riboflavin (B2)",
      quantity: 302.315997540233,
      unit: "%",
    },
    NIA: {
      label: "Niacin (B3)",
      quantity: 346.631453561036,
      unit: "%",
    },
    VITB6A: {
      label: "Vitamin B6",
      quantity: 266.618709749494,
      unit: "%",
    },
    FOLDFE: {
      label: "Folate equivalent (total)",
      quantity: 402.807066133717,
      unit: "%",
    },
    VITB12: {
      label: "Vitamin B12",
      quantity: 880.416666666667,
      unit: "%",
    },
    VITD: {
      label: "Vitamin D",
      quantity: 18.6666666666667,
      unit: "%",
    },
    TOCPHA: {
      label: "Vitamin E",
      quantity: 108.509640088255,
      unit: "%",
    },
    VITK1: {
      label: "Vitamin K",
      quantity: 2573.31580171978,
      unit: "%",
    },
  },
  digest: [
    {
      label: "Fat",
      tag: "FAT",
      schemaOrgTag: "fatContent",
      total: 233.734370647488,
      hasRDI: true,
      daily: 359.591339457674,
      unit: "g",
      sub: [
        {
          label: "Saturated",
          tag: "FASAT",
          schemaOrgTag: "saturatedFatContent",
          total: 84.6509624293534,
          hasRDI: true,
          daily: 423.254812146767,
          unit: "g",
        },
        {
          label: "Trans",
          tag: "FATRN",
          schemaOrgTag: "transFatContent",
          total: 0.038,
          hasRDI: false,
          daily: 0,
          unit: "g",
        },
        {
          label: "Monounsaturated",
          tag: "FAMS",
          schemaOrgTag: null,
          total: 109.776609372666,
          hasRDI: false,
          daily: 0,
          unit: "g",
        },
        {
          label: "Polyunsaturated",
          tag: "FAPU",
          schemaOrgTag: null,
          total: 22.3901277179862,
          hasRDI: false,
          daily: 0,
          unit: "g",
        },
      ],
    },
    {
      label: "Carbs",
      tag: "CHOCDF",
      schemaOrgTag: "carbohydrateContent",
      total: 109.292887790658,
      hasRDI: true,
      daily: 36.4309625968859,
      unit: "g",
      sub: [
        {
          label: "Carbs (net)",
          tag: "CHOCDF.net",
          schemaOrgTag: null,
          total: 73.0196877906578,
          hasRDI: false,
          daily: 0,
          unit: "g",
        },
        {
          label: "Fiber",
          tag: "FIBTG",
          schemaOrgTag: "fiberContent",
          total: 36.2732,
          hasRDI: true,
          daily: 145.0928,
          unit: "g",
        },
        {
          label: "Sugars",
          tag: "SUGAR",
          schemaOrgTag: "sugarContent",
          total: 23.7086339534736,
          hasRDI: false,
          daily: 0,
          unit: "g",
        },
        {
          label: "Sugars, added",
          tag: "SUGAR.added",
          schemaOrgTag: null,
          total: 0,
          hasRDI: false,
          daily: 0,
          unit: "g",
        },
      ],
    },
    {
      label: "Protein",
      tag: "PROCNT",
      schemaOrgTag: "proteinContent",
      total: 177.766218517441,
      hasRDI: true,
      daily: 355.532437034882,
      unit: "g",
    },
    {
      label: "Cholesterol",
      tag: "CHOLE",
      schemaOrgTag: "cholesterolContent",
      total: 948,
      hasRDI: true,
      daily: 316,
      unit: "mg",
    },
    {
      label: "Sodium",
      tag: "NA",
      schemaOrgTag: "sodiumContent",
      total: 1087.02630128729,
      hasRDI: true,
      daily: 45.2927625536372,
      unit: "mg",
    },
    {
      label: "Calcium",
      tag: "CA",
      schemaOrgTag: null,
      total: 1591.68687012029,
      hasRDI: true,
      daily: 159.168687012029,
      unit: "mg",
    },
    {
      label: "Magnesium",
      tag: "MG",
      schemaOrgTag: null,
      total: 724.392645348684,
      hasRDI: true,
      daily: 172.474439368734,
      unit: "mg",
    },
    {
      label: "Potassium",
      tag: "K",
      schemaOrgTag: null,
      total: 7761.56927128213,
      hasRDI: true,
      daily: 165.139771729407,
      unit: "mg",
    },
    {
      label: "Iron",
      tag: "FE",
      schemaOrgTag: null,
      total: 64.3744654360404,
      hasRDI: true,
      daily: 357.635919089113,
      unit: "mg",
    },
    {
      label: "Zinc",
      tag: "ZN",
      schemaOrgTag: null,
      total: 40.0166917441842,
      hasRDI: true,
      daily: 363.788106765311,
      unit: "mg",
    },
    {
      label: "Phosphorus",
      tag: "P",
      schemaOrgTag: null,
      total: 2133.82076162763,
      hasRDI: true,
      daily: 304.831537375376,
      unit: "mg",
    },
    {
      label: "Vitamin A",
      tag: "VITA_RAE",
      schemaOrgTag: null,
      total: 3385.856,
      hasRDI: true,
      daily: 376.206222222222,
      unit: "µg",
    },
    {
      label: "Vitamin C",
      tag: "VITC",
      schemaOrgTag: null,
      total: 587.977,
      hasRDI: true,
      daily: 653.307777777778,
      unit: "mg",
    },
    {
      label: "Thiamin (B1)",
      tag: "THIA",
      schemaOrgTag: null,
      total: 1.84902732267434,
      hasRDI: true,
      daily: 154.085610222862,
      unit: "mg",
    },
    {
      label: "Riboflavin (B2)",
      tag: "RIBF",
      schemaOrgTag: null,
      total: 3.93010796802303,
      hasRDI: true,
      daily: 302.315997540233,
      unit: "mg",
    },
    {
      label: "Niacin (B3)",
      tag: "NIA",
      schemaOrgTag: null,
      total: 55.4610325697658,
      hasRDI: true,
      daily: 346.631453561036,
      unit: "mg",
    },
    {
      label: "Vitamin B6",
      tag: "VITB6A",
      schemaOrgTag: null,
      total: 3.46604322674342,
      hasRDI: true,
      daily: 266.618709749494,
      unit: "mg",
    },
    {
      label: "Folate equivalent (total)",
      tag: "FOLDFE",
      schemaOrgTag: null,
      total: 1611.22826453487,
      hasRDI: true,
      daily: 402.807066133717,
      unit: "µg",
    },
    {
      label: "Folate (food)",
      tag: "FOLFD",
      schemaOrgTag: null,
      total: 1611.22826453487,
      hasRDI: false,
      daily: 0,
      unit: "µg",
    },
    {
      label: "Folic acid",
      tag: "FOLAC",
      schemaOrgTag: null,
      total: 0,
      hasRDI: false,
      daily: 0,
      unit: "µg",
    },
    {
      label: "Vitamin B12",
      tag: "VITB12",
      schemaOrgTag: null,
      total: 21.13,
      hasRDI: true,
      daily: 880.416666666667,
      unit: "µg",
    },
    {
      label: "Vitamin D",
      tag: "VITD",
      schemaOrgTag: null,
      total: 2.8,
      hasRDI: true,
      daily: 18.6666666666667,
      unit: "µg",
    },
    {
      label: "Vitamin E",
      tag: "TOCPHA",
      schemaOrgTag: null,
      total: 16.2764460132383,
      hasRDI: true,
      daily: 108.509640088255,
      unit: "mg",
    },
    {
      label: "Vitamin K",
      tag: "VITK1",
      schemaOrgTag: null,
      total: 3087.97896206374,
      hasRDI: true,
      daily: 2573.31580171978,
      unit: "µg",
    },
    {
      label: "Sugar alcohols",
      tag: "Sugar.alcohol",
      schemaOrgTag: null,
      total: 0,
      hasRDI: false,
      daily: 0,
      unit: "g",
    },
    {
      label: "Water",
      tag: "WATER",
      schemaOrgTag: null,
      total: 2102.30404808006,
      hasRDI: false,
      daily: 0,
      unit: "g",
    },
  ],
};

export default function RecipesSearch() {
  const appKey = "c6ab28eb023f254744f9f2e13c33c10e";
  const appID = "c8aa1a6e";
  let token = readToken();

  const [recipe, setRecipe] = useState(mockRecipe);

  const [recipes, setRecipes] = useState([]);
  const [displayModal, setDisplayModal] = useState(false);
  const [favorites, setFavorites] = useAtom(favoritesAtom);
  const [inFavorites, setInFavorites] = useState(false);

  const [errorMessage, setErrorMessage] = useAtom(errorMessageAtom);
  const [userInput, setUserInput] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  // const [favoriteRecipes, setFavoriteRecipes] = useAtom(favoriteRecipesAtom);
  const recipesPerPage = 3;

  const lastRecipeIndex = currentPage * recipesPerPage;
  const firstRecipeIndex = lastRecipeIndex - recipesPerPage;
  const currentRecipes = recipes.slice(firstRecipeIndex, lastRecipeIndex);

  const handleCloseModal = () => setDisplayModal(false);

  useEffect(() => {
    const getFavorites = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/favorites`,
          {
            method: "GET",
          }
        );
        const data = await response.json();

        setFavorites(data);
      } catch (err) {
        console.error("Error fetching favourites:", err);
      }
    };

    getFavorites();
  }, []);

  function isFavorite(recipeURL) {
    for (let i = 0; i < favorites.length; i++) {
      if (favorites[i].url == recipeURL) {
        return true;
      }
    }
    return false;
  }

  const toggleFavorite = async () => {
    const recipeURL = recipe.url;
    if (isFavorite(recipe.url)) {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/favorites/${recipe.label}`,
          {
            method: "DELETE",
          }
        );

        if (!response.ok) {
          throw new Error("HTTP error" + response.status);
        }

        console.log("Recipe was removed from favourites");

        setFavorites(
          favorites.filter(function (el) {
            return el.url !== recipeURL;
          })
        );

        setInFavorites(false);
      } catch (err) {
        console.error("Error removing recipe from favourites:", err);
      }
    } else {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/favorites`,
          {
            method: "POST",
            body: JSON.stringify({
              recipeLabel: recipe.label,
              url: recipe.url,
            }),
            headers: {
              "content-type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("HTTP error " + response.status);
        }

        console.log("Recipe added to favourites");

        setFavorites([
          ...favorites,
          { recipeLabel: recipe.label, url: recipe.url },
        ]);

        setInFavorites(true);
      } catch (err) {
        console.error("Error adding recipe to favourites: ", err);
      }
    }
  };

  function setupRecipe(index) {
    setRecipe(recipes[index].recipe);

    setDisplayModal(true);

    setInFavorites(isFavorite(recipes[index].recipe.url));
  }

  function searchRecipes(userInput) {
    const foodName = userInput.toLowerCase();

    setCurrentPage(1);

    fetch(
      `https://api.edamam.com/api/recipes/v2?type=public&q=${foodName}&app_id=${appID}&app_key=${appKey}&imageSize=REGULAR`
    )
      .then((res) => res.json())
      .then((data) => {
        // setFavoriteRecipes(() => ({ ...favoriteRecipes, [data.id]: data }));

        setRecipes(data.hits);
      })
      .catch((err) => {
        console.log(err);
        setErrorMessage(
          "Error: Sorry, something went wrong. Please try again."
        );
      });
  }
  return (
    <>
      {token && (
        <div className="py-3 w-100">
          <div className="px-4 pt-3  search">
            <div id="search-field" className="mb-4">
              <form
                className="d-flex"
                role="search"
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    searchRecipes(userInput);
                  }
                }}
              >
                <input
                  className="form-control w-100"
                  id="userInput"
                  type="search"
                  placeholder="Enter food name"
                  aria-label="Search"
                  value={userInput}
                  onChange={(event) => {
                    setUserInput(event.target.value);
                  }}
                />

                <button
                  id="searchBtn"
                  className="mx-2 btn"
                  type="button"
                  style={{ width: "fit-content" }}
                  onClick={() => {
                    searchRecipes(userInput);
                  }}
                >
                  Search
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
      <div
        className="container row m-auto gap-5"
        style={{ width: "max-content" }}
      >
        {currentRecipes.length > 0 &&
          currentRecipes.map((recipe, index) => {
            return (
              <div
                className="card glass"
                key={index}
                style={{ paddingLeft: 0, paddingRight: 0 }}
              >
                <img
                  src={recipe.recipe.images.REGULAR.url}
                  className="card-img-top"
                />
                <div className="text-dark py-3 px-4">
                  <h4>{recipe.recipe.label}</h4>

                  <div className="d-flex justify-content-between text-justify pt-1">
                    <div className="d-grid gap-2 fs-5">
                      <p>{recipe.recipe.totalNutrients.PROCNT.label}:</p>
                      <p>{recipe.recipe.totalNutrients.FAT.label}:</p>
                      <p>{recipe.recipe.totalNutrients.CHOCDF.label}:</p>
                    </div>
                    <div className="d-grid gap-2 fs-5 pe-2 text-end">
                      <p>
                        {Math.round(
                          recipe.recipe.totalNutrients.PROCNT.quantity
                        )}{" "}
                        {recipe.recipe.totalNutrients.PROCNT.unit}
                      </p>
                      <p>
                        {Math.round(recipe.recipe.totalNutrients.FAT.quantity)}{" "}
                        {recipe.recipe.totalNutrients.FAT.unit}
                      </p>
                      <p>
                        {Math.round(
                          recipe.recipe.totalNutrients.CHOCDF.quantity
                        )}{" "}
                        {recipe.recipe.totalNutrients.CHOCDF.unit}
                      </p>
                    </div>
                  </div>
                  <div className="d-flex justify-content-between gap-2 pt-2">
                    <p className="display-4">
                      <strong>
                        {Math.round(
                          recipe.recipe.totalNutrients.ENERC_KCAL.quantity /
                            recipe.recipe.yield
                        )}
                      </strong>
                    </p>
                    <div className="d-grid gap-2 w-100">
                      <p className="pt-2">
                        {recipe.recipe.totalNutrients.ENERC_KCAL.unit}
                        <br />
                        <strong className="fs-5 pb-2">
                          {recipe.recipe.totalNutrients.ENERC_KCAL.label}
                        </strong>
                      </p>
                    </div>

                    <button
                      className="mx-2 mt-3 customBtn btn "
                      onClick={() => setupRecipe(index + 3 * (currentPage - 1))}
                      type="button"
                      data-bs-toggle="modal"
                      data-bs-target="#recipeModal"
                    >
                      Recipe
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        <div
          className={`modal  fade  ${displayModal ? "show" : ""}`}
          id="recipeModal"
          aria-labelledby="recipeModalLabel"
          aria-modal={`${displayModal ? "true" : "false"}`}
          style={{
            display: displayModal ? "block" : "none",
          }}
          role="dialog"
        >
          <div
            className="modal-dialog modal-dialog-centered"
            style={{
              maxWidth: "700px !important",
            }}
          >
            <div className="modal-content">
              <div className="row px-3 pt-2">
                <div className="col-4">
                  <img className="pt-2" src={recipe.images.SMALL.url} />
                </div>
                <div className="col-8">
                  <div className="d-flex justify-content-between text-justify pt-1">
                    <h1
                      className="modal-title fs-5 pt-1"
                      id="recipeModalLabel "
                    >
                      {recipe.label}
                    </h1>
                    <button
                      type="button"
                      className="btn-close "
                      data-bs-dismiss="modal"
                      aria-label="Close"
                      onClick={handleCloseModal}
                    ></button>
                  </div>
                  <p>
                    {recipe.dietLabels.join(" • ") +
                      " • " +
                      recipe.healthLabels.join(" • ")}
                  </p>
                </div>
              </div>

              <div className="modal-body row">
                <div
                  className="d-grid fs-5 col"
                  style={{ width: "fit-content", height: "fit-content" }}
                >
                  <h2>
                    <strong>{Math.round(recipe.yield)} servings</strong>
                  </h2>
                  <div
                    className="d-flex justify-content-between gap-2 pt-2 "
                    style={{ height: "fit-content" }}
                  >
                    <div>
                      <p className="display-4">
                        <strong>
                          {Math.round(
                            recipe.totalNutrients.ENERC_KCAL.quantity /
                              recipe.yield
                          )}
                        </strong>
                      </p>
                    </div>

                    <div className="d-grid gap-2 w-100">
                      <p className="pt-2">
                        {recipe.totalNutrients.ENERC_KCAL.unit}
                        <br />
                        <strong className="fs-5 pb-2">
                          {recipe.totalNutrients.ENERC_KCAL.label}
                        </strong>
                      </p>
                    </div>
                  </div>
                </div>
                <div
                  className="d-flex justify-content-between text-justify col"
                  style={{ height: "fit-content" }}
                >
                  <div className="d-grid gap-2 fs-5">
                    <p>{recipe.totalNutrients.PROCNT.label}:</p>
                    <p>{recipe.totalNutrients.FAT.label}:</p>
                    <p>{recipe.totalNutrients.CHOCDF.label}:</p>
                  </div>
                  <div className="d-grid gap-2 fs-5 pe-2 text-end">
                    <p>
                      {Math.round(recipe.totalNutrients.PROCNT.quantity)}{" "}
                      {recipe.totalNutrients.PROCNT.unit}
                    </p>
                    <p>
                      {Math.round(recipe.totalNutrients.FAT.quantity)}{" "}
                      {recipe.totalNutrients.FAT.unit}
                    </p>
                    <p>
                      {Math.round(recipe.totalNutrients.CHOCDF.quantity)}{" "}
                      {recipe.totalNutrients.CHOCDF.unit}
                    </p>
                  </div>
                </div>
                <div className="d-flex justify-content-between text-justify pt-1 col">
                  <div className="d-grid gap-2 fs-5">
                    {recipe.digest.slice(3, 9).map((digest, index) => {
                      return (
                        <h6 key={"digestLabel" + index}>{digest.label}:</h6>
                      );
                    })}
                  </div>
                  <div className="d-grid gap-2 fs-5 pe-2 text-end">
                    {recipe.digest.slice(3, 9).map((digest, index) => {
                      return (
                        <h6 key={"digestValue" + index}>
                          {Math.round(digest.total / recipe.yield)}{" "}
                          {digest.unit}
                        </h6>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                  onClick={handleCloseModal}
                >
                  Close
                </button>
                {!inFavorites && (
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={toggleFavorite}
                  >
                    Add to Favorites
                  </button>
                )}
                {inFavorites && (
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={toggleFavorite}
                  >
                    Delete from Favorites
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {recipes.length > 0 && (
        <div className="mt-3 m-auto " style={{ width: "max-content" }}>
          <RecipesPagination
            totalRecipes={recipes.length}
            recipesPerPage={recipesPerPage}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </div>
      )}
    </>
  );
}
