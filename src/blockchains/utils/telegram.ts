import axios from 'axios';

export class Telegram {
  static pushNotification = async (text: string): Promise<boolean> => {
    let result: boolean;

    await axios
      .get(
        `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
        {
          params: {
            chat_id: process.env.TELEGRAM_CHAT_ID,
            text: text,
          },
        },
      )
      .then(function (response) {
        result = true;
      })
      .catch(function (error) {
        result = false;
      });

    return result;
  };
}
