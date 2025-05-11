require('dotenv').config();

//import express.js module
const express = require("express");

//image manipulation
const multer = require('multer');
const sharp = require('sharp');

//password encryption
const bcrypt = require('bcrypt');

//handle session token
const jwt = require('jsonwebtoken');

const fs = require('fs'); // Import the file system module

//Needed to run api commands to act as proxy server
// Use dynamic import for ES Module 
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

//assign "app" variable to the "express()" which is used to call express.js functions
const app = express();

//import cors module
const cors = require("cors");

//import the "pool" object from db.js
//require is importing whatever is exported from db.js and saves it as pool object
const pool = require("./db");

const dbInit = require('./dbinit');

const upload = multer({ dest: 'uploads/' });

//middleware
app.use(cors());
app.use(express.json()); //req.body

app.use('/uploads', express.static('uploads'));

//----------Middleware Authentication Token Validation----------//
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ error: "Authorization header missing" });
    }

    const token = authHeader.split(" ")[1]; // Extract the token (Bearer <token>)

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
        req.userId = decoded.userId; // Attach the userId to the request object
        next(); // Proceed to the next middleware or route handler
    } catch (err) {
        return res.status(403).json({ error: "Invalid or expired token" });
    }
};

//----------API REQUESTS----------//
//Search for Recipes
app.get('/api/getrecipes', async (req, res) => {
    const { query, number } = req.query; 
    const apiKey = process.env.SPOONACULAR_API;
    const apiUrl = `https://api.spoonacular.com/recipes/complexSearch?query=${query}&number=${number}&apiKey=${apiKey}`; 
    console.log(apiUrl);
    try { 
        const response = await fetch(apiUrl); 
        const data = await response.json(); 
        res.json(data);
    } catch (error) { 
        console.error('Error fetching search from Spoonacular:', error);
        console.log('Error fetching search from Spoonacular:', error);
        res.status(500).json({ error: 'Internal Server Error' }); 
    }
});

app.get('/api/getrecipesing', async (req, res) => {
    const { query, number } = req.query; 
    const apiKey = process.env.SPOONACULAR_API;
    
    const ingredients = query.split(",").map((item) => item.trim()).join(",+");
    const apiUrl = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredients}&number=${number}&apiKey=${apiKey}`;  
    console.log(apiUrl);
    
    try { 
        const response = await fetch(apiUrl); 
        const data = await response.json(); 
        res.json(data);
    } catch (error) { 
        console.error('Error fetching search from Spoonacular:', error);
        console.log('Error fetching search from Spoonacular:', error);
        res.status(500).json({ error: 'Internal Server Error' }); 
    }
});

//Recipe Steps by ID
app.get('/api/getrecipeinfo', async (req, res) => {
    const { id } = req.query;
    const apiKey = process.env.SPOONACULAR_API;
    const apiUrl = `https://api.spoonacular.com/recipes/${id}/analyzedInstructions?&apiKey=${apiKey}`; 
    console.log(apiUrl);
    try { 
        const response = await fetch(apiUrl); 
        const data = await response.json(); 
        res.json(data);
    } catch (error) { 
        console.error('Error fetching item from Spoonacular:', error);
        console.log('Error fetching item from Spoonacular:', error);
        res.status(500).json({ error: 'Internal Server Error' }); 
    }
});

//Recipe Ingredients by ID
app.get('/api/getrecipeing', async (req, res) => {
    const { id } = req.query;
    const apiKey = process.env.SPOONACULAR_API;
    const apiUrl = `https://api.spoonacular.com/recipes/${id}/ingredientWidget.json?&apiKey=${apiKey}`; 
    console.log(apiUrl);
    try { 
        const response = await fetch(apiUrl); 
        const data = await response.json(); 
        res.json(data);
    } catch (error) { 
        console.error('Error fetching item ing from Spoonacular:', error);
        console.log('Error fetching item ing from Spoonacular:', error);
        res.status(500).json({ error: 'Internal Server Error' }); 
    }
});

//Recipe Image by ID
app.get('/api/proxy-image', async (req, res) => {
    const imageUrl = req.query.url;
    try {
        const response = await fetch(imageUrl);
        const buffer = await response.buffer();
        res.set('Content-Type', response.headers.get('content-type'));
        res.send(buffer);
    } catch (error) {
        console.error('Error fetching image:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


//----------ROUTES----------//

//The Below is Sample Data. Needs to be Updated

//----------Create addRecipe

app.post("/api/add", authenticateToken, upload.single('image'), async (req, res) => {
    try {
        const { name, categories, ingredients, Steps, notes } = req.body;
        const userId = req.userId; // Extracted from the token
        let imagePath = null;

        // Parse JSON strings
        const parsedCategories = JSON.parse(categories);
        const parsedIngredients = JSON.parse(ingredients);
        const parsedSteps = JSON.parse(Steps);

        if (req.file) {
            const resizedImagePath = `uploads/resized-${req.file.filename}.jpg`;
            await sharp(req.file.path)
                .resize(300, 300)
                .toFormat('jpeg')
                .toFile(resizedImagePath);
            imagePath = resizedImagePath;
        }

        // Add New Recipe
        const newRecipe = await pool.query(
            "INSERT INTO Recipes (user_id, name, is_favorite, notes, image) VALUES($1, $2, FALSE, $3, $4) RETURNING recipe_id",
            [userId, name, notes, imagePath]
        );
        const recipe_id = newRecipe.rows[0].recipe_id;

        // Add Ingredients
        for (const ingredient of parsedIngredients) {
            await pool.query(
                "INSERT INTO Ingredients (recipe_id, name, quantity) VALUES($1, $2, $3)",
                [recipe_id, ingredient.name, ingredient.amount]
            );
        }

        // Add Steps
        for (const [index, step] of parsedSteps.entries()) {
            await pool.query(
                "INSERT INTO Steps (recipe_id, step_number, description) VALUES($1, $2, $3)",
                [recipe_id, index + 1, step.direction]
            );
        }

        // Add Categories
        for (const category of parsedCategories) {
            await pool.query(
                "INSERT INTO Categories (recipe_id, category) VALUES($1, $2)",
                [recipe_id, category]
            );
        }

        res.json(newRecipe.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post("/api/mealplan", authenticateToken, async (req, res) => {
    try {
        const { mealPlanName, notes } = req.body;
        const userId = req.userId; // Extracted from the token

        // Add New Meal Plan
        const newMealPlan = await pool.query(
            "INSERT INTO mealplans (user_id, name, notes) VALUES($1, $2, $3) RETURNING meal_plan_id",
            [userId, mealPlanName, notes]
        );

        res.json({ message: "Meal plan added successfully" });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
);

//----------Get Meal Plans
app.get("/api/mealplans", authenticateToken, async (req, res) => {
    try {
        const userId = req.userId; // Extracted from the token

        // Fetch meal plans for the user
        const mealPlans = await pool.query(
            "SELECT * FROM MealPlans WHERE user_id = $1",
            [userId]
        );

        res.json(mealPlans.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
);

//----------Get Meal Plan Details

app.get("/api/mealplandetails/:id", authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId; // Extracted from the token

        // Fetch meal plan details for the user
        const mealPlanDetails = await pool.query(`
            SELECT 
                mp.notes, -- Include notes from the MealPlans table
                mpr.recipe_id, 
                mpr.recipe_name
            FROM 
                MealPlans mp
            LEFT JOIN 
                MealPlanRecipes mpr ON mp.meal_plan_id = mpr.meal_plan_id
            WHERE 
                mp.meal_plan_id = $1 AND mp.user_id = $2
            ORDER BY 
                mpr.recipe_name ASC
        `, [id, userId]);

        res.json(mealPlanDetails.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//----------Delete Meal Plan

app.delete("/api/deletemealplan/:id", authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId; // Extracted from the token

        // Check if the meal plan belongs to the user
        const mealPlan = await pool.query(
            "SELECT * FROM MealPlans WHERE meal_plan_id = $1 AND user_id = $2",
            [id, userId]
        );

        if (mealPlan.rows.length === 0) {
            return res.status(403).json({ error: "You do not have permission to delete this meal plan" });
        }

        // Delete the meal plan
        await pool.query("DELETE FROM MealPlans WHERE meal_plan_id = $1 AND user_id = $2", [id, userId]);

        res.json({ message: `Meal plan with id ${id} deleted successfully` });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//----------Add Recipe to Meal Plan

app.post("/api/addtomealplan", authenticateToken, async (req, res) => {
    try {
        const { recipeId, mealPlanId } = req.body;
        const userId = req.userId; // Extracted from the token

        console.log('Request body', req.body);
        // Check if the recipe belongs to the user
        const recipe = await pool.query(
            "SELECT * FROM Recipes WHERE recipe_id = $1 AND user_id = $2",
            [recipeId, userId]
        );

        if (recipe.rows.length === 0) {
            return res.status(403).json({ error: "You do not have permission to add this recipe to the meal plan" });
        }

        const recipe_name = recipe.rows[0].name;

        // Add Recipe to Meal Plan
        await pool.query(
            "INSERT INTO MealPlanRecipes (meal_plan_id, recipe_id, recipe_name) VALUES($1, $2, $3)",
            [mealPlanId, recipeId, recipe_name]
        );

        res.json({ message: "Recipe added to meal plan successfully" });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
);

//----------Read All Recipies and Categories

app.get("/api/all", authenticateToken, async (req, res) => {
    try {
        const userId = req.userId; // Extracted from the token

        const allRecipes = await pool.query(`
            SELECT 
                r.recipe_id, 
                r.is_favorite, 
                r.name,
                r.image, 
                STRING_AGG(c.category, ', ') AS categories
            FROM 
                Recipes r
            LEFT JOIN 
                Categories c ON r.recipe_id = c.recipe_id
            WHERE 
                r.user_id = $1
            GROUP BY 
                r.recipe_id
        `, [userId]);

        res.json(allRecipes.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//----------Create add Search
app.post("/api/search/add", authenticateToken, upload.single('image'), async (req, res) => {
    try {
        const { name, ing, steps } = req.body;
        const userId = req.userId; // Extracted from the token
        let imagePath = null;

        // Parse JSON strings
        const parsedIngredients = JSON.parse(ing);
        const parsedSteps = JSON.parse(steps);

        if (req.file) {
            const resizedImagePath = `uploads/resized-${req.file.filename}.jpg`;
            await sharp(req.file.path)
                .resize(300, 300)
                .toFormat('jpeg')
                .toFile(resizedImagePath);
            imagePath = resizedImagePath;
        }

        // Add New Recipe
        const newRecipe = await pool.query(
            "INSERT INTO Recipes (user_id, name, is_favorite, image) VALUES($1, $2, FALSE, $3) RETURNING recipe_id",
            [userId, name, imagePath]
        );

        // Save Recipe ID from newRecipe
        const recipe_id = newRecipe.rows[0].recipe_id;

        // Add Ingredients
        for (const ingredient of parsedIngredients) {
            await pool.query(
                "INSERT INTO Ingredients (recipe_id, name, quantity) VALUES($1, $2, $3)",
                [recipe_id, ingredient.name, ingredient.amount]
            );
        }

        // Add Steps
        for (const [index, step] of parsedSteps.entries()) {
            await pool.query(
                "INSERT INTO Steps (recipe_id, step_number, description) VALUES($1, $2, $3)",
                [recipe_id, index + 1, step.instruction]
            );
        }

        res.json(newRecipe.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//Read 1
app.get("/api/recipe/:id", authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId; // Extracted from the token

        // Check if the recipe belongs to the user
        const recipe = await pool.query(
            "SELECT * FROM Recipes WHERE recipe_id = $1 AND user_id = $2",
            [id, userId]
        );

        if (recipe.rows.length === 0) {
            return res.status(403).json({ error: "You do not have permission to view this recipe" });
        }

        // Fetch recipe details
        const recipeDetails = await pool.query(`
            SELECT 
                r.recipe_id, 
                r.name, 
                r.is_favorite, 
                r.notes,
                r.image, 
                STRING_AGG(DISTINCT c.category, ', ') AS categories,
                json_agg(DISTINCT jsonb_build_object('name', i.name, 'quantity', i.quantity)) AS ingredients,
                json_agg(DISTINCT jsonb_build_object('step_number', s.step_number, 'description', s.description)) AS steps
            FROM 
                Recipes r
            LEFT JOIN 
                Categories c ON r.recipe_id = c.recipe_id
            LEFT JOIN 
                Ingredients i ON r.recipe_id = i.recipe_id
            LEFT JOIN 
                Steps s ON r.recipe_id = s.recipe_id
            WHERE 
                r.recipe_id = $1 AND r.user_id = $2
            GROUP BY 
                r.recipe_id
        `, [id, userId]);

        res.json(recipeDetails.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//Update

app.put("/api/edit-recipe/:id", authenticateToken, upload.single('image'), async (req, res) => {
    try {
        const { id } = req.params;
        const { name, categories, ingredients, Steps, notes } = req.body;
        const userId = req.userId; // Extracted from the token
        let imagePath = null;

        // Check if the recipe belongs to the user
        const recipe = await pool.query(
            "SELECT * FROM Recipes WHERE recipe_id = $1 AND user_id = $2",
            [id, userId]
        );

        if (recipe.rows.length === 0) {
            return res.status(403).json({ error: "You do not have permission to edit this recipe" });
        }

        // Parse JSON strings
        const parsedCategories = JSON.parse(categories);
        const parsedIngredients = JSON.parse(ingredients);
        const parsedSteps = JSON.parse(Steps);

        if (req.file) {
            const resizedImagePath = `uploads/resized-${req.file.filename}.jpg`;
            await sharp(req.file.path)
                .resize(300, 300)
                .toFormat('jpeg')
                .toFile(resizedImagePath);
            imagePath = resizedImagePath;
        }

        // Update Recipe
        const updatedRecipe = await pool.query(
            "UPDATE Recipes SET name = $1, notes = $2, image = COALESCE($3, image) WHERE recipe_id = $4 AND user_id = $5 RETURNING recipe_id",
            [name, notes, imagePath, id, userId]
        );

        // Delete old ingredients, steps, and categories
        await pool.query("DELETE FROM Ingredients WHERE recipe_id = $1", [id]);
        await pool.query("DELETE FROM Steps WHERE recipe_id = $1", [id]);
        await pool.query("DELETE FROM Categories WHERE recipe_id = $1", [id]);

        // Add new ingredients
        for (const ingredient of parsedIngredients) {
            await pool.query(
                "INSERT INTO Ingredients (recipe_id, name, quantity) VALUES($1, $2, $3)",
                [id, ingredient.name, ingredient.amount]
            );
        }

        // Add new steps
        for (const [index, step] of parsedSteps.entries()) {
            await pool.query(
                "INSERT INTO Steps (recipe_id, step_number, description) VALUES($1, $2, $3)",
                [id, index + 1, step.direction]
            );
        }

        // Add new categories
        for (const category of parsedCategories) {
            await pool.query(
                "INSERT INTO Categories (recipe_id, category) VALUES($1, $2)",
                [id, category]
            );
        }

        res.json({ message: `Recipe with id ${id} updated successfully` });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//Delete

app.delete("/api/delete/:id", authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId; // Extracted from the token

        // Check if the recipe belongs to the user
        const recipe = await pool.query(
            "SELECT * FROM Recipes WHERE recipe_id = $1 AND user_id = $2",
            [id, userId]
        );

        if (recipe.rows.length === 0) {
            return res.status(403).json({ error: "You do not have permission to delete this recipe" });
        }

        // Delete the recipe
        await pool.query("DELETE FROM Recipes WHERE recipe_id = $1 AND user_id = $2", [id, userId]);

        res.json({ message: `Recipe with id ${id} deleted successfully` });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//Add Favorite

app.put("/api/addfav/:id", authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId; // Extracted from the token

        // Check if the recipe belongs to the user
        const recipe = await pool.query(
            "SELECT * FROM Recipes WHERE recipe_id = $1 AND user_id = $2",
            [id, userId]
        );

        if (recipe.rows.length === 0) {
            return res.status(403).json({ error: "You do not have permission to modify this recipe" });
        }

        // Update Recipe
        await pool.query(
            "UPDATE Recipes SET is_favorite = TRUE WHERE recipe_id = $1 AND user_id = $2",
            [id, userId]
        );

        res.json({ message: `Recipe with id ${id} added to favorites successfully` });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//Remove Favorite

app.put("/api/delfav/:id", authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId; // Extracted from the token

        // Check if the recipe belongs to the user
        const recipe = await pool.query(
            "SELECT * FROM Recipes WHERE recipe_id = $1 AND user_id = $2",
            [id, userId]
        );

        if (recipe.rows.length === 0) {
            return res.status(403).json({ error: "You do not have permission to modify this recipe" });
        }

        // Update Recipe
        await pool.query(
            "UPDATE Recipes SET is_favorite = FALSE WHERE recipe_id = $1 AND user_id = $2",
            [id, userId]
        );

        res.json({ message: `Recipe with id ${id} removed from favorites successfully` });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//Get User
app.get("/api/user", authenticateToken, async (req, res) => {

    const userId = req.userId;

    try {
        // Fetch user details
        const user = await pool.query(
            "SELECT * FROM Users WHERE user_id = $1",
            [userId]
        );

        if (user.rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        const userData = user.rows[0];

         // If profile_image is null, return null or a default placeholder
         res.json({
            user_id: userData.user_id,
            username: userData.username,
            profile_image: userData.profile_image ? userData.profile_image.toString('base64') : null, // Convert binary to base64
        });

    }
    catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }

});

//Update User
app.put("/api/user/update", authenticateToken, upload.single('profileImage'), async (req, res) => {

    try {
        const userId = req.userId;

        let profileImageBinary = null;

        // Handle profile image upload
        if (req.file) {
            profileImageBinary = fs.readFileSync(req.file.path); // Read the image as binary data
            fs.unlinkSync(req.file.path); // Delete the temporary file after reading
        }

        // Update Recipe
        await pool.query(
            "UPDATE Users SET profile_image = $1 WHERE user_id = $2",
            [profileImageBinary, userId]
        );

        res.json({ message: `User with id ${userId} updated successfully` });

    }
    catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//----------User Registration----------//

app.post('/api/register', upload.single('profileImage'), async (req, res) => {
    try {
        const { username, password, question1, question2, answer1, answer2 } = req.body;

        // Check if the username already exists
        const existingUser = await pool.query(
            "SELECT * FROM Users WHERE username = $1",
            [username]
        );

        if (existingUser.rows.length > 0) {
            return res.status(400).json({ error: "Username already exists" });
        }

        // Hash the password using bcrypt
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const hashedAnswer1 = await bcrypt.hash(answer1, saltRounds);
        const hashedAnswer2 = await bcrypt.hash(answer2, saltRounds);

        let profileImageBinary = null;

        // Handle profile image upload
        if (req.file) {
            profileImageBinary = fs.readFileSync(req.file.path); // Read the image as binary data
            fs.unlinkSync(req.file.path); // Delete the temporary file after reading
        }

        // Insert the new user into the database
        const newUser = await pool.query(
            "INSERT INTO Users (username, password_hash, profile_image, question1, question2, answer1, answer2) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING user_id",
            [username, hashedPassword, profileImageBinary, question1, question2, hashedAnswer1, hashedAnswer2]
        );

        res.status(201).json({ message: "User registered successfully", userId: newUser.rows[0].user_id });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

//----------User Login----------//

app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check if the user exists
        const user = await pool.query(
            "SELECT * FROM Users WHERE username = $1",
            [username]
        );

        if (user.rows.length === 0) {
            return res.status(401).json({ error: "Invalid username or password" });
        }

        const storedHashedPassword = user.rows[0].password_hash;

        // Compare the provided password with the stored hashed password
        const isPasswordValid = await bcrypt.compare(password, storedHashedPassword);

        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid username or password" });
        }

        // Generate a JWT token
        const token = jwt.sign(
            { userId: user.rows[0].user_id, username: user.rows[0].username },
            process.env.JWT_SECRET, // Use a secret key from your environment variables
            { expiresIn: '1h' } // Token expires in 1 hour
        );

        res.status(200).json({
            message: "Login successful",
            token, // Return the token to the client
            userId: user.rows[0].user_id,
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

//----------User Password Reset----------//
app.get('/api/user-reset/:username', async (req, res) => {
    try {
        const { username } = req.params;

        // Check if the user exists
        const user = await pool.query(
            "SELECT * FROM Users WHERE username = $1",
            [username]
        );

        if (user.rows.length === 0) {
            return res.status(401).json({ error: "Invalid username" });
        }

        const userData = user.rows[0];

        res.status(200).json({
            message: "User found",
            userId: userData.user_id,
            question1: userData.question1,
            question2: userData.question2,
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.get('/api/user-reset-check/:username/:answer1/:answer2', async (req, res) => {
    try {
        const { username, answer1, answer2 } = req.params;

        // Check if the user exists
        const user = await pool.query(
            "SELECT * FROM Users WHERE username = $1",
            [username]
        );

        if (user.rows.length === 0) {
            return res.status(401).json({ error: "Invalid username" });
        }

        const userData = user.rows[0];

        // Compare the provided answers with the stored hashed answers
        const isAnswer1Valid = await bcrypt.compare(answer1, userData.answer1);
        const isAnswer2Valid = await bcrypt.compare(answer2, userData.answer2);

        // Check if at least one answer is valid
        if (!isAnswer1Valid && !isAnswer2Valid) {
            return res.status(401).json({ error: "Invalid answers" });
        }

        res.status(200).json({ 
            message: "Valid Answer",
            valid: true,
         });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.put('/api/user-reset-password', async (req, res) => {
    try {
        const { username, newPassword } = req.body;

        // Check if the user exists
        const user = await pool.query(
            "SELECT * FROM Users WHERE username = $1",
            [username]
        );

        if (user.rows.length === 0) {
            return res.status(401).json({ error: "Invalid username" });
        }

        // Hash the new password using bcrypt
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

        // Update the user's password in the database
        await pool.query(
            "UPDATE Users SET password_hash = $1 WHERE username = $2",
            [hashedPassword, username]
        );

        res.status(200).json({ message: "Password reset successful" });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

//Use the express variable alternative "app" makes server listen on port 5000.
//When connectino is recieved it runs the function inside "listen()"
dbInit()
  .then(() => {
    console.log('Database is ready!');
    // Start the server only after the database is initialized
    app.listen(5000, () => {
      console.log('Server is running on port 5000');
    });
  })
  .catch((err) => {
    console.error('Failed to initialize the database:', err);
    process.exit(1); // Exit the application if database initialization fails
  });
