exports.sendWhatsAppNotification = async (phone, message) => {
  console.log(`📱 [MOCK WhatsApp] To: ${phone} | Msg: ${message}`);
  return { success: true, mock: true };
};
