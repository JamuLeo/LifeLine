import Favourite from "../models/Favourite.js";

export const addFavourite = async (req, res) => {
  try {
    const { donorId, campaign } = req.body;
    if (!donorId || !campaign) return res.json({ success: false, message: "Missing donorId or campaign" });
    const exists = await Favourite.findOne({ donorId, campaign });
    if (exists) return res.json({ success: false, message: "Already favourited" });
    const favourite = await Favourite.create({ donorId, campaign });
    res.json({ success: true, favourite });
  } catch (e) {
    res.json({ success: false, message: e.message });
  }
};

export const removeFavourite = async (req, res) => {
  try {
    const { donorId, campaign } = req.body;
    await Favourite.deleteOne({ donorId, campaign });
    res.json({ success: true, message: "Removed from favourites" });
  } catch (e) {
    res.json({ success: false, message: e.message });
  }
};

export const getFavourites = async (req, res) => {
  try {
    const { donorId } = req.params;
    const favourites = await Favourite.find({ donorId }).populate("campaign");
    res.json({ success: true, favourites });
  } catch (e) {
    res.json({ success: false, message: e.message });
  }
};

export const isFavourite = async (req, res) => {
  try {
    const { donorId, campaign } = req.query;
    const fav = await Favourite.findOne({ donorId, campaign });
    res.json({ success: true, isFavourite: !!fav });
  } catch (e) {
    res.json({ success: false, message: e.message });
  }
};
