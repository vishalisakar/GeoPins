const { AuthenticationError, PubSub } = require("apollo-server");
const Pin = require("./models/Pin");

const pubsub = new PubSub()
const PIN_ADDED = "PIN_ADDED"
const PIN_DELETED = "PIN_DELETED"
const PIN_UPDATED = "PIN_UPDATED"

const mapboxApi = {
  // apiKey: process.env.MAPBOX_TOKEN
  apiKey:
    "pk.eyJ1IjoidmlzaGFsaXZpc2h1IiwiYSI6ImNrNmhrdzduNzFib3czbG52cDJlZzU3YWkifQ.Mst9N0Hlqk3syJ_G66JWwQ"
};

const authenticated = next => (root, args, ctx, info) => {
  if (!ctx.currentUser) {
    throw new AuthenticationError("You must be Logged in ");
  }
  console.log(ctx.currentUser);
  return next(root, args, ctx, info);
};

module.exports = {
  Query: {
    getUser: authenticated((root, args, ctx) => ctx.currentUser),
    // me : () => user
    getMapboxKey: () => mapboxApi,
    getPins: async (root, args, ctx) => {
      const pins = await Pin.find({})
        .populate("author")
        .populate("comments.author");
      return pins;
    }
  },
  Mutation: {
    createPin: authenticated(async (root, args, ctx) => {
      const newPin = await new Pin({
        ...args.input,
        author: ctx.currentUser._id
      }).save();
      const pinAdded = await Pin.populate(newPin, "author");
      pubsub.publish(PIN_ADDED, { pinAdded })
      return pinAdded;
    }),
    
    deletePin: authenticated(async (root, args, ctx) => {
      const pinDeleted = await Pin.findOneAndDelete({ _id: args.pinId }).exec();
      pubsub.publish(PIN_DELETED, { pinDeleted })
      return pinDeleted;
    }),

    createComment: authenticated(async (root, args, ctx) => {
      const newComment = { text: args.text, author: ctx.currentUser._id };
      const pinUpdated = await Pin.findOneAndUpdate(
        { _id: args.pinId },
        { $push: { comments: newComment } }, 
        { new: true }
      )
        .populate("author")
        .populate("comments.author");
      console.log(`pin update`,pinUpdated)
      pubsub.publish(PIN_UPDATED, { pinUpdated })
      return pinUpdated;
    })
  },
  Subscription: {
      pinAdded: {
        subscribe: () => pubsub.asyncIterator(PIN_ADDED)
      },
      pinDeleted: {
        subscribe: () => pubsub.asyncIterator(PIN_DELETED)
      },
      pinUpdated : {
        subscribe: () => pubsub.asyncIterator(PIN_UPDATED)
      }
  }
};
