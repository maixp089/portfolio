import express from "express";
import portfolioRouter from "./routes/portfolio";
import skillRouter from "./routes/skill";
import contactRouter from "./routes/contact";
import imageRouter from "./routes/image";
const app = express();

app.use(express.json());
app.use("/api/portfolios", portfolioRouter);
app.use("/api/skills", skillRouter);
app.use("/api/contacts", contactRouter);
app.use("/api/images", imageRouter);


app.listen(3001, () => {
  console.log("APIサーバー起動中！");
});
