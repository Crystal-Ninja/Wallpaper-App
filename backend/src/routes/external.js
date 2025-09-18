import { Router } from "express";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const router = Router();

const UNSPLASH_KEY = process.env.UNSPLASH_ACCESS_KEY; 

const defaultImages = [
  { id: "local1", url: "ironman.jpeg", thumb: "ironman.jpeg", author: "Local", link: "#2" },
  { id: "local2", url: "skull.jpeg", thumb: "skull.jpeg", author: "Local", link: "#1" },
  { id: "local3", url: "watercat.jpeg", thumb: "watercat.jpeg", author: "Local", link: "#" },  
  { id: "local4", url: "ladybug.jpeg", thumb: "ladybug.jpeg", author: "Local", link: "#4" },
  { id: "local5", url: "blackcat.jpeg", thumb: "blackcat.jpeg", author: "Local", link: "#5" },
  { id: "local6", url: "architect.jpeg", thumb: "architect.jpeg", author: "Local", link: "#" },
  { id: "local7", url: "redcat.jpeg", thumb: "redcat.jpeg", author: "Local", link: "#" },
  { id: "local8", url: "japan.jpeg", thumb: "japan.jpeg", author: "Local", link: "#" },
  { id: "local9", url: "grass.jpeg", thumb: "grass.jpeg", author: "Local", link: "#" },
  { id: "local10", url: "lamp.jpeg", thumb: "lamp.jpeg", author: "Local", link: "#" },
  { id: "local1", url: "sheep.jpeg", thumb: "sheep.jpeg", author: "Local", link: "#" },  
  { id: "local12", url: "wallpaper.jpeg", thumb: "wallpaper.jpeg", author: "Local", link: "#" },
  { id: "local13", url: "yello.jpeg", thumb: "yello.jpeg", author: "Local", link: "#" },
  { id: "local14", url: "car.jpeg", thumb: "car.jpeg", author: "Local", link: "#" },
  { id: "local16", url: "zoro.jpeg", thumb: "zoro.jpeg", author: "Local", link: "#" },
  { id: "local17", url: "shep.jpeg", thumb: "shep.jpeg", author: "Local", link: "#" },
  { id: "local18", url: "momo.jpeg", thumb: "momo.jpeg", author: "Local", link: "#" },
  { id: "local19", url: "luffy.jpeg", thumb: "luffy.jpeg", author: "Local", link: "#" },
  { id: "local20", url: "dog.jpeg", thumb: "dog.jpeg", author: "Local", link: "#" },
  { id: "local21", url: "flower.jpeg", thumb: "flower.jpeg", author: "Local", link: "#" },
  { id: "local22", url: "fish.jpeg", thumb: "fish.jpeg", author: "Local", link: "#3" },
  { id: "local23", url: "spidy.jpeg", thumb: "spidy.jpeg", author: "Local", link: "#" },
  { id: "local24", url: "cherry.jpeg", thumb: "cherry.jpeg", author: "Local", link: "#" },
  { id: "local25", url: "window.jpeg", thumb: "window.jpeg", author: "Local", link: "#" },
  { id: "local26", url: "tree.jpeg", thumb: "op.jpeg", author: "Local", link: "#" },
  { id: "local27", url: "rdr.jpeg", thumb: "op.jpeg", author: "Local", link: "#" },
  { id: "local28", url: "bug.jpeg", thumb: "op.jpeg", author: "Local", link: "#" },
  { id: "local29", url: "op.jpeg", thumb: "op.jpeg", author: "Local", link: "#" },

];
router.get("/", async (req, res, next) => {
  try {
    const { query = "", page = 1, per_page = 20 } = req.query;

    // Build base URL (e.g. http://localhost:5000)
    const baseUrl = `${req.protocol}://${req.get("host")}`;

    // Update local images to use full URLs
    const localImages = defaultImages.map(img => ({
      ...img,
      url: `${baseUrl}/static-images/${img.url}`,
      thumb: `${baseUrl}/static-images/${img.url}`
    }));

    if (!query) {
      return res.json({ items: localImages });
    }

    const r = await axios.get("https://api.unsplash.com/search/photos", {
      params: { query, page, per_page },
      headers: { Authorization: `Client-ID ${UNSPLASH_KEY}` }
    });

    const unsplashItems = r.data.results.map(x => ({
      id: x.id,
      url: x.urls.regular,
      thumb: x.urls.regular,
      author: x.user.name,
      link: x.links.html,
      type:"external",
    }));
    res.json({ items:unsplashItems });
  } catch (e) {
    next(e);
  }
});
export default router