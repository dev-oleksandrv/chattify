import environment from "@/environment";
import { sendCandidateAction } from "../ws/websocket-actions";
import { addRoomStream } from "@/store/room-store";

export class RTCClient {
  private stream: MediaStream | null = null;
  private connection: RTCPeerConnection | null = null;

  constructor(private readonly userId: number) {
    const pc = new RTCPeerConnection({
      iceServers: [
        {
          urls: environment.webrtcUrl!,
          username: "test",
          credential: "test",
        },
      ],
    });

    pc.onicecandidate = this.handleOnIceCandidateEvent.bind(this);
    pc.ontrack = this.handleOnTrackEvent.bind(this);

    this.connection = pc;
  }

  public getUserId(): number {
    return this.userId;
  }

  public getStream(): MediaStream | null {
    return this.stream;
  }

  public setStream(stream: MediaStream): void {
    this.stream = stream;
  }

  public addTrack(track: MediaStreamTrack, stream: MediaStream): void {
    if (this.connection) {
      this.connection.addTrack(track, stream);
    }
  }

  public async createOffer(
    setLocalDescription: boolean = true
  ): Promise<RTCSessionDescriptionInit | null> {
    if (!this.connection) {
      console.warn(
        `[RTCClient(${this.userId})]: cannot create offer cause no connection`
      );
      return null;
    }

    console.log(`[RTCClient(${this.userId})]: creating offer`);
    const offer = await this.connection.createOffer();
    if (setLocalDescription) {
      await this.connection.setLocalDescription(offer);
    }

    return offer;
  }

  public async createAnswer(
    setLocalDescription: boolean = true
  ): Promise<RTCSessionDescriptionInit | null> {
    if (!this.connection) {
      console.warn(
        `[RTCClient(${this.userId})]: cannot create answer cause no connection`
      );
      return null;
    }

    console.log(`[RTCClient(${this.userId})]: creating answer`);
    const answer = await this.connection.createAnswer();
    if (setLocalDescription) {
      await this.connection.setLocalDescription(answer);
    }

    return answer;
  }

  public async applyAnswer(sdp: string): Promise<void> {
    if (!this.connection) {
      console.warn(
        `[RTCClient(${this.userId})]: cannot apply answer cause no connection`
      );
      return;
    }
    console.log(`[RTCClient(${this.userId})]: apply answer`);
    await this.connection.setRemoteDescription(
      new RTCSessionDescription({ type: "answer", sdp })
    );
  }

  public async applyCandidate(candidate: string): Promise<void> {
    if (!this.connection) {
      console.warn(
        `[RTCClient(${this.userId})]: cannot apply candidate cause no connection`
      );
      return;
    }
    console.log(`[RTCClient(${this.userId})]: apply candidate`);
    await this.connection.addIceCandidate(
      new RTCIceCandidate({ candidate, sdpMid: "0", sdpMLineIndex: 0 })
    );
  }

  public async setRemoteDescription(
    type: RTCSdpType,
    sdp: string
  ): Promise<void> {
    if (!this.connection) {
      console.warn(
        `[RTCClient(${this.userId})]: cannot set remote description no connection`
      );
      return;
    }

    await this.connection.setRemoteDescription(
      new RTCSessionDescription({ type: type, sdp })
    );
  }

  private handleOnTrackEvent(event: RTCTrackEvent): void {
    console.log(`[RTCClient(${this.userId})]: track event`, event);
    const remoteStream = new MediaStream();
    event.streams[0]
      .getTracks()
      .forEach((track) => remoteStream.addTrack(track));

    this.stream = remoteStream;

    addRoomStream(this.userId, remoteStream);
  }

  private handleOnIceCandidateEvent(event: RTCPeerConnectionIceEvent): void {
    console.log(`[RTCClient(${this.userId})]: ice candidate event`, event);
    if (event.candidate) {
      sendCandidateAction({
        target: this.userId,
        candidate: event.candidate.candidate,
      });
    }
  }
}
