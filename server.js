const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5500;
const MONGODB_URI = process.env.CONNECTION_URL;

mongoose.connect(MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.error("Error connecting to MongoDB:", error));
app.use(express.json());

// Define Recipe model
const Recipe = mongoose.model("Recipe", {
  title: String,
  ingredients: [String],
  instructions: String,
  cookingTime: String
});
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
  });
  

// CRUD operations

// i. Show all recipes
app.get("/api/recipes", async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ii. Retrieve a specific recipe by title
app.get("/api/recipes/:title", async (req, res) => {
  const title = req.params.title;
  try {
    const recipe = await Recipe.findOne({ title });
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }
    res.json(recipe);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// iii. Create a new recipe
app.post("/api/recipes", async (req, res) => {
  const { title, ingredients, instructions, cookingTime } = req.body;
  try {
    const existingRecipe = await Recipe.findOne({ title });
    if (existingRecipe) {
      return res.status(409).json({ message: "Recipe already exists" });
    }
    const newRecipe = await Recipe.create({ title, ingredients, instructions, cookingTime });
    res.status(201).json(newRecipe);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// iv. Update a recipe
app.put("/api/recipes/:id", async (req, res) => {
  const id = req.params.id;
  const { title, ingredients, instructions, cookingTime } = req.body;
  try {
    const updatedRecipe = await Recipe.findByIdAndUpdate(id, { title, ingredients, instructions, cookingTime }, { new: true });
    if (!updatedRecipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }
    res.json(updatedRecipe);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// v. Delete a recipe
app.delete("/api/recipes/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const deletedRecipe = await Recipe.findByIdAndDelete(id);
    if (!deletedRecipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }
    res.json({ message: "Recipe deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
