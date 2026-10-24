const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const Chat = require('../models/Chat.model');
const Review = require('../models/Review.model');
const geminiService = require('../services/gemini.service');

/**
 * @route POST /api/chat
 * Sends a message to the AI assistant, creating a new chat if needed.
 */
const sendMessage = catchAsync(async (req, res) => {
  const { message, chatId, reviewId } = req.body;

  let chat;
  if (chatId) {
    chat = await Chat.findOne({ _id: chatId, user: req.user._id });
    if (!chat) {
      throw ApiError.notFound('Chat not found');
    }
  } else {
    chat = await Chat.create({
      user: req.user._id,
      review: reviewId || null,
      title: message.slice(0, 50),
      messages: [],
    });
  }

  // Build code context if a review is linked
  let codeContext = {};
  const linkedReviewId = chat.review || reviewId;
  if (linkedReviewId) {
    const review = await Review.findOne({ _id: linkedReviewId, user: req.user._id });
    if (review) {
      codeContext = {
        code: review.code,
        language: review.language,
        reviewSummary: review.result?.summary || '',
      };
    }
  }

  // Append user message
  chat.messages.push({ role: 'user', content: message });

  // Get AI reply (use history excluding the message just added, then pass message separately)
  const history = chat.messages.slice(0, -1).map((m) => ({ role: m.role, content: m.content }));
  const reply = await geminiService.chatWithAI(history, message, codeContext);

  chat.messages.push({ role: 'assistant', content: reply });
  await chat.save();

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        chatId: chat._id,
        reply,
        messages: chat.messages,
      },
      'Message sent'
    )
  );
});

/**
 * @route GET /api/chat
 * List all chats for the user (summary view).
 */
const getChats = catchAsync(async (req, res) => {
  const chats = await Chat.find({ user: req.user._id })
    .select('title review createdAt updatedAt')
    .sort({ updatedAt: -1 });

  return res.status(200).json(new ApiResponse(200, { chats }, 'Chats fetched'));
});

/**
 * @route GET /api/chat/:chatId
 */
const getChatById = catchAsync(async (req, res) => {
  const chat = await Chat.findOne({ _id: req.params.chatId, user: req.user._id });

  if (!chat) {
    throw ApiError.notFound('Chat not found');
  }

  return res.status(200).json(new ApiResponse(200, { chat }, 'Chat fetched'));
});

/**
 * @route DELETE /api/chat/:chatId
 */
const deleteChat = catchAsync(async (req, res) => {
  const chat = await Chat.findOneAndDelete({ _id: req.params.chatId, user: req.user._id });

  if (!chat) {
    throw ApiError.notFound('Chat not found');
  }

  return res.status(200).json(new ApiResponse(200, null, 'Chat deleted'));
});

module.exports = { sendMessage, getChats, getChatById, deleteChat };