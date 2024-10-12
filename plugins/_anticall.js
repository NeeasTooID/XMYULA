let handler = m => m
handler.before = async function (m) {
  this.ev.on('call', async (call) => {
    if (call[0].status === 'offer') {
      await this.sendMessage(call[0].from, {
        text: `*## Sorry, Your Number is Banneds*\n\nWe understand that you may be frustrated that your account has been suspended. We implement this policy to maintain a safe and friendly environment for all users.\n\nYour account was suspended because you violated our terms of service by calling a bot. We apologize for the inconvenience, but this behavior cannot be tolerated.\n\nIf you believe an error has occurred, please contact our support team via email [ *${global.mail}* ] and explain your situation.\n\nThank you for your understanding.`,
        quoted: call[0]
      });
      await this.rejectCall(call[0].id, call[0].from);
      global.db.data.users[call[0].from].banned = true;
      await this.updateBlockStatus(call[0].from, "block");
    }
  });
}

export default handler