const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  try {
    // Find all tags and include associated Product data
    const tagData = await Tag.findAll({
      attributes: ["id", "tag_name"],
      include: [
        {
          model: Product,
          attributes: ["id", "product_name", "price", "stock", "category_id"],
          through: { attributes: [] }, // Specify the attributes to include or exclude as needed
        },
      ],
    });

    if (tagData) {
      res.json(tagData);
    } else {
      res.status(404).json({ message: "No tags found." });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get('/:id', (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
  Tag.findByPk(req.params.id, {
    include: [
      {
        model: Product,
        attributes: ["id", "product_name", "price", "stock", "category_id"],
        through:"ProductTag",
      },
    ],
  })
  .then((singleTag) => {
    res.json(singleTag);
  })
  .catch((err) => {
    res.json(err);
  });
});

router.post('/', (req, res) => {
  // create a new tag
  Tag.create({
    tag_name: req.body.tag_name,
  })
  .then((tag) => {
    res.json(tag);
  })
  .catch((err) =>
  res.json(err))
});

router.put('/:id', (req, res) => {
  // update a tag's name by its `id` value
  Tag.update(
    {tag_name: req.body.tag_name},
    {
      where: {
        id:req.params.id,
      },
    }
  )
  .then((tag) => {
    res.json(tag);
  })
  .catch((err) => {
    res.json(err);
  });
  
  });


router.delete('/:id', (req, res) => {
  // delete on tag by its `id` value
  Tag.destroy({where: {
    id:req.params.id,
  },
})
.then((deletedTag) => {
  res.json(`${deletedTag} tag were removed from the database`);
})
.catch((err) => {
  res.json(err);
});
});

module.exports = router;
