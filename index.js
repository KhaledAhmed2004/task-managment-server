const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId, ServerApiVersion } = require("mongodb");

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
// app.use(
//   cors({
//     origin: "http://localhost:5173",
//     credentials: true,
//   })
// );

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://task-b43e7.web.app",
      "https://task-b43e7.firebaseapp.com",
    ],
    credentials: true,
  })
);

const uri =
  "mongodb+srv://admin:gPN7gjQ7pOd9XReK@cluster0.vuqcpzn.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const taskCollection = client.db("taskManager").collection("tasks");

    app.get("/tasks", async (req, res) => {
      try {
        const userEmail = req?.query?.email;
        console.log("User Email:", userEmail);
        const result = await taskCollection
          .find({ email: userEmail })
          .toArray();
        res.send(result);
      } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
      }
    });

    // app.get("/tasks", async (req, res) => {
    //   try {
    //     const userEmail = req.query.email;
    //     const result = await taskCollection
    //       .find({ userEmail: userEmail })
    //       .toArray();
    //     res.send(result);
    //   } catch (error) {
    //     console.error(error);
    //     res.status(500).send("Internal Server Error");
    //   }
    // });

    // app.get("/tasks", async (req, res) => {
    //   try {
    //     const result = await taskCollection.find().toArray();
    //     res.send(result);
    //   } catch (error) {
    //     console.error(error);
    //     res.status(500).send("Internal Server Error");
    //   }
    // });

    // app.get("/tasks/:taskId", async (req, res) => {
    //   const taskId = req.params.taskId;
    //   const query = { _id: new ObjectId(taskId) };
    //   const result = await taskCollection.findOne(query);
    //   res.send(result);
    // });

    app.post("/task", async (req, res) => {
      try {
        const task = req.body;
        console.log(task);
        const result = await taskCollection.insertOne(task);
        res.send(result);
      } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
      }
    });

    app.put("/tasks/:taskId", async (req, res) => {
      try {
        const { taskId } = req.params;
        const query = { _id: new ObjectId(taskId) };
        const update = { $set: req.body };
        const result = await taskCollection.updateOne(query, update);
        res.send(result);
      } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
      }
    });

    app.delete("/tasks/:taskId", async (req, res) => {
      try {
        const { taskId } = req.params;
        const query = { _id: new ObjectId(taskId) };
        const result = await taskCollection.deleteOne(query);
        res.send(result);
      } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
      }
    });

    console.log("Routes registered successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
}

run().catch(console.error);

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
