export const validateNote = (req, res, next) => {
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({
      error: "Title and content are required",
    });
  }

  next();
};
