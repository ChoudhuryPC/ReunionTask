const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");
const authenticate = require("../authenticate")
const passport = require("passport")

//delete a post

router.delete("/:id",authenticate.verifyUser, async (req, res) => {
  console.log(req.params.id)
  console.log(req.user._id)
  try {
    const post = await Post.findById(req.params.id);

    console.log(post)
    if (post.userId == req.user._id) {

      post.deleteOne();
      res.status(200).json("the post has been deleted");
    } else {
      res.status(403).json("you can delete only your post");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//create a post

router.post("/",authenticate.verifyUser, async (req, res) => {
  console.log(req.user._id)
  const newPost = new Post({ userId: req.user._id,
  title: req.body.title,
  description: req.body.description
 });
  try {
    const savedPost = await newPost.save();
    const{ img,updatedAt,likes,comments,__v,userId, ...other} = savedPost._doc
    res.status(200).json(other);
  } catch (err) {
    res.status(500).json(err);
  }
});
//update a post

router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.updateOne({
        $set: req.body
      });
      res.status(200).json("the post has been updated");
    } else {
      res.status(403).json("you can update only your post");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//like / dislike a post

router.post("/like/:id",authenticate.verifyUser, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post.likes.includes(req.user._id)) {
      await post.updateOne({
        $push: {
          likes: req.user._id
        }
      });
      res.status(200).json("The post has been liked");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});
//dislike a post
router.post("/dislike/:id",authenticate.verifyUser, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.likes.includes(req.user._id)) {
      await post.updateOne({
        $pull: {
          likes: req.user._id
        }
      });
      res.status(200).json("The post has been disliked");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//get timeline posts done
router.get("/all", authenticate.verifyUser,  async (req, res) => {
  User.findById(req.user._id).then(user => {
    Post.find({
      userId: user._id
    }).then(posts => {
      res.json({
        posts: posts
      })
    })
  })
});

//get a post DONE

router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json({_id: post._id,
    title: post.title,
    description: post.description,
    createdAt: post.createdAt,
    comments: post.comments,
    likes: post.likes.length
  });
  } catch (err) {
    res.status(500).json(err);
  }
});


//Comment on a post
router.post("/comment/:id",authenticate.verifyUser, async (req, res)=>{
  try{
    const post = await Post.findById(req.params.id)
    
    post.comments.push({comment: req.body.comment,
      authorId: req.user._id})
    post.save()
    res.status(200).json(post.comments._id)

  }catch(err) {
    res.status(403).json(err);
  }

})

module.exports = router;