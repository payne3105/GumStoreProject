import { Alert, LinearProgress } from "@mui/material";
import React, { useEffect, useState } from "react";
import Category from "../components/Category";
import Item from "../components/Item";
import useFetch from "../hooks/useFetch";
import styles from "../style/catalog.module.css";
import Search from "../components/Search";

export default function Catalog() {
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");
  const [items, setItems] = useState([]);

  const { data, loading, error } = useFetch(
    `http://localhost:1337/api/gums?populate=photo`
  );

  const handleChangeSearch = (newValue) => {
    setSearch(newValue);
  };

  const handleChangeCategory = (newValue) => {
    setCategory(newValue);
  };

  const handleSearch = async (value) => {
    await fetch(
      `http://localhost:1337/api/gums?populate=photo&filters[title][$containsi]=${value}`
    )
      .then((response) => response.json())
      .then((data) => setItems(data.data));
  };

  const handleCategory = async (value) => {
    await fetch(
      `http://localhost:1337/api/gums?populate=*&filters[categories][title][$contains]=${value}`
    )
      .then((response) => response.json())
      .then((data) => setItems(data.data));
  };

  useEffect(() => {
    if (data) {
      setItems(data);
    }
  }, [data]);

  useEffect(() => {
    handleSearch(search);
  }, [search]);

  useEffect(() => {
    handleCategory(category);
  }, [category]);

  if (loading) return <LinearProgress />;
  if (error) return <Alert>{error}</Alert>;

  return (
    <div>
      <div className={styles.catalog_title_container}>
        <h1 className={styles.catalog_title}>Каталог</h1>
        <Search onSearchChange={handleChangeSearch} />
      </div>
      <Category onCategoryChange={handleChangeCategory} />

      <ul className={styles.catalog_list}>
        {items.map((element) => (
          <Item
            id={element.id}
            key={element.id}
            imageSrc={element.attributes.photo.data.attributes.url}
            gum={{
              title: element.attributes.title,
              price: element.attributes.price,
            }}
          />
        ))}
      </ul>
    </div>
  );
}
