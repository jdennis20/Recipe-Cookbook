import React, { Fragment } from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Provider } from './components/ui/provider'; // Adjust the path if necessary
import "@fontsource/baloo-2/700.css";
import Home from "./Pages/Home";
import Add from "./Pages/AddRecipe";
import My from "./Pages/MyRecipes";
import Search from "./Pages/SearchRecipes";
import Category from "./Pages/Categories";
import Cat from "./Pages/Category";
import EditRecipe from './Pages/EditRecipe';
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Account from "./Pages/Account";
import PasswordReset from "./Pages/PasswordReset";
import MealPlan from "./Pages/MealPlan";

import './App.css';

function App() {
  return (
    <Fragment>
      <Router>
        <Provider>
          <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/add" element={<Add />} />
            <Route path="/my" element={<My />} />
            <Route path="/search" element={<Search />} />
            <Route path="/category" element={<Category />} />
            <Route path="/edit-recipe/:recipe_id" element={<EditRecipe />} />
            <Route path="/recipe/:cat" element={<Cat />} />
            <Route path="/login" element={<Login />} />
            <Route path="/reg" element={<Register />} />
            <Route path="/account" element={<Account />} />
            <Route path="/password-reset" element={<PasswordReset />} />
            <Route path="/" element={<Home />} />
            <Route path="/mealplan" element={<MealPlan />} />
          </Routes>
        </Provider>
      </Router>
    </Fragment>
  );
}

export default App;
