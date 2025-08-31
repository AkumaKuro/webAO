import { client } from "../client";
import { MessageType } from "../client/sender/messageEncoder";
import setCookie from "../utils/setCookie";



window.onload = () => {
  (window as any).hcallback = (hcaptcharesponse: string) => {
    setCookie("hdid", client.hdid);
    client.sender.sendServer(MessageType.TWO_FACTOR, [hcaptcharesponse]);
    location.reload();
  };
};

