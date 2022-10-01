const mongoose = require("mongoose");
mongoose
  .connect("mongodb://localhost:27017/social-network", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useCreateIndex: true,
    // useFindAndModify: false,
    // useFindAnyModify: false
  })
  .then(() => console.log("mongodb connected"))
  .catch((err) => console.log("errer to conect mongodb", err));
