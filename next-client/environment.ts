import "./envConfig";

export default {
  apiUrl: process.env.NEXT_PUBLIC_API_URL!,
  wsUrl: process.env.NEXT_PUBLIC_WS_URL!,
  webrtcUrl: process.env.NEXT_PUBLIC_WEBRTC_URL!,
};
