import _ from "lodash";
import { useCallback, useEffect, useRef, useState } from "react";
import { browserClient } from "~/supa-client";
import type { RealtimeChannel } from "@supabase/supabase-js";

interface TypingIndicatorProps {
  roomId: string;
  userId: string;
}

interface Payload {
  userId: string;
}

export const useTypingIndicator = ({
  roomId,
  userId,
}: TypingIndicatorProps) => {
  const [isTyping, setIsTyping] = useState(false);
  const [payload, setPayload] = useState<Payload | null>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    const newChannel = browserClient.channel(`typing:${roomId}`);

    const onTyping = (payload: Payload) => {
      setPayload(payload);
      setIsTyping(true);
      hideTypingIndicator();
    };

    const hideTypingIndicator = () => {
      setTimeout(() => setIsTyping(false), 2000);
    };

    newChannel.on("broadcast" as any, { event: "typing" }, onTyping);
    const subscription = newChannel.subscribe();

    channelRef.current = newChannel;

    return () => {
      subscription.unsubscribe();
    };
  }, [roomId, userId]);

  const throttledTypingEvent = _.throttle(() => {
    if (!channelRef.current) return;
    channelRef.current.send({
      type: "broadcast",
      event: "typing",
      payload: { userId },
    });
  }, 3000);

  const sendTypingEvent = useCallback(() => {
    throttledTypingEvent();
  }, [throttledTypingEvent]);

  return { payload, isTyping, sendTypingEvent };
};
