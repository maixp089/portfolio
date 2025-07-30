import express from "express";
import cors from 'cors';
import portfolioRouter from "./routes/portfolio";
import skillRouter from "./routes/skill";
import contactRouter from "./routes/contact";
const app = express();

app.use(cors({
  origin: 'http://localhost:3000', 
  credentials: true 
}));
app.use(express.json());
app.use("/api/portfolios", portfolioRouter);
app.use("/api/skills", skillRouter);
app.use("/api/contacts", contactRouter);
app.use('/uploads', express.static('uploads'));


app.listen(4000, () => {
  console.log("APIサーバー起動中！");
});
