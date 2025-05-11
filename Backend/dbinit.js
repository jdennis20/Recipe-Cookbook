const pool = require('./db'); // Import the database connection from db.js

const createTables = async () => {
  const queries = [
    `
    CREATE TABLE IF NOT EXISTS Users (
      user_id SERIAL PRIMARY KEY,
      username VARCHAR(50) NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      profile_image BYTEA,
      question1 VARCHAR(255) NOT NULL,
      question2 VARCHAR(255) NOT NULL,
      answer1 VARCHAR(255) NOT NULL,
      answer2 VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    `,
    `
    CREATE TABLE IF NOT EXISTS Recipes (
      recipe_id SERIAL PRIMARY KEY,
      user_id INT NOT NULL,
      name VARCHAR(100) NOT NULL,
      is_favorite BOOLEAN DEFAULT FALSE,
      notes TEXT,
      image VARCHAR,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
    )
    `,
    `
    CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = CURRENT_TIMESTAMP;
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql
    `,
    `
    CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON Recipes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column()
    `,
    `
    CREATE TABLE IF NOT EXISTS Ingredients (
      ingredient_id SERIAL PRIMARY KEY,
      recipe_id INT NOT NULL,
      name VARCHAR(100) NOT NULL,
      quantity VARCHAR(50),
      FOREIGN KEY (recipe_id) REFERENCES Recipes(recipe_id) ON DELETE CASCADE
    )
    `,
    `
    CREATE TABLE IF NOT EXISTS Steps (
      step_id SERIAL PRIMARY KEY,
      recipe_id INT NOT NULL,
      step_number INT NOT NULL,
      description TEXT NOT NULL,
      FOREIGN KEY (recipe_id) REFERENCES Recipes(recipe_id) ON DELETE CASCADE
    )
    `,
    `
    CREATE TABLE IF NOT EXISTS Categories (
      recipe_id INT NOT NULL,
      category VARCHAR(50) NOT NULL,
      PRIMARY KEY (recipe_id, category),
      FOREIGN KEY (recipe_id) REFERENCES Recipes(recipe_id) ON DELETE CASCADE
    )
    `,
    `
    CREATE TABLE IF NOT EXISTS MealPlans (
      meal_plan_id SERIAL PRIMARY KEY,
      user_id INT NOT NULL,
      name VARCHAR(100) NOT NULL,
      notes TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
    )
    `,
    `
    CREATE OR REPLACE FUNCTION update_mealplan_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = CURRENT_TIMESTAMP;
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql
    `,
    `
    CREATE TRIGGER set_mealplan_updated_at
    BEFORE UPDATE ON MealPlans
    FOR EACH ROW
    EXECUTE FUNCTION update_mealplan_updated_at_column()
    `,
    `
    CREATE TABLE IF NOT EXISTS MealPlanRecipes (
      meal_plan_id INT NOT NULL,
      recipe_id INT NOT NULL,
      recipe_name VARCHAR(100),
      PRIMARY KEY (meal_plan_id, recipe_id),
      FOREIGN KEY (meal_plan_id) REFERENCES MealPlans(meal_plan_id) ON DELETE CASCADE,
      FOREIGN KEY (recipe_id) REFERENCES Recipes(recipe_id) ON DELETE CASCADE
    )
    `,
  ];

  for (const query of queries) {
    await pool.query(query).catch((err) => console.error("Error executing query:", err));
  }

  console.log("Tables created successfully.");
};

// Export the `dbInit` function
const dbInit = async () => {
  try {
    await createTables();
    console.log("Database initialization complete.");
  } catch (err) {
    console.error("Error initializing database:", err);
    throw err;
  }
};

module.exports = dbInit;