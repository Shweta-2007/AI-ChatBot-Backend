import app from "./app";
import { connectToDatabase } from "./db/connection";

const PORT = process.env.PORT || 4000;

connectToDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log("Server is running at 4000");
    });
  })
  .catch((err) => console.log(err));
