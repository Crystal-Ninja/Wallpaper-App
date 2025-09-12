import { Router } from "express";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const router = Router();

const UNSPLASH_KEY = process.env.UNSPLASH_ACCESS_KEY; 

router.get("/", async (req, res, next) => {
  try {
    const { query = "wallpaper", page = 1, per_page = 20 } = req.query;

    
    const r = await axios.get("https://api.unsplash.com/search/photos", {
      params: { query, page, per_page },
      headers: { Authorization: `Client-ID ${UNSPLASH_KEY}` }
    });

    const items = r.data.results.map(x => ({
      id: x.id,
      url: x.urls.regular,
      thumb: x.urls.small,
      author: x.user.name,
      link: x.links.html
    }));
    res.json({ items });
  } catch (e) { next(e); }
});

export default router;
