const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
const bodyParser = require("body-parser");
const port = process.env.PORT || 3000;

const app = express();

app.use(cors());
app.use(express.json());

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(
    require("./tinkering24-88f4d-firebase-adminsdk-tf8a5-33716c6887.json")
  ),
  databaseURL: "https://your-project-id.firebaseio.com",
});

const db = admin.firestore();
// const app = express();
app.use(bodyParser.json());

app.get("/", (req, res, next) => {
  try {
    res.json({
      message: "successful",
    });
  } catch (error) {
    next(error);
  }
});

app.post("/api", (req, res, next) => {
  try {
    const { token } = req.body;
    if (!token) throw new Error("Token is missing");

    //yaha firebase pr check

    res.json({
      message: "Alert has been sent",
    });
  } catch (error) {
    next(error);
  }
});

// POST endpoint for fall detection
app.post("/fallDetection", async (req, res) => {
  const { userId } = req.body; // Assuming you send userId from ESP32

  try {
    // Get the FCM token for the user from Firestore
    const userDoc = await db.collection("users").doc(userId).get();
    if (!userDoc.exists) {
      return res.status(404).send("User not found");
    }

    const userData = userDoc.data();
    const fcmToken = userData.fcmToken;
    console.log("usertoken", fcmToken);

    // Send notification if fall is detected
    const message = {
      token: fcmToken,
      notification: {
        title: "Fall Detected",
        body: "A fall has been detected. Please check on the user.",
      },
    };

    await admin.messaging().send(message);
    res.status(200).send("Notification sent successfully");
  } catch (error) {
    console.error("Error sending notification:", error);
    res.status(500).send("Internal server error");
  }
});

app.use((error, req, res, next) => {
  console.error(error.stack);
  res.status(500).json({
    error: "An unexpected error occurred",
    message: error.message,
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
