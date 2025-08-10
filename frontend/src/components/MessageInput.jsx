import { useRef, useState } from "react";
import { useChatStore } from "./useChatStore";
import { Send, Image, X, Loader } from "lucide-react";

const MessageInput = () => {
    const [text, setText] = useState("");
    const [mediaPreview, setMediaPreview] = useState(null);
    const [mediaType, setMediaType] = useState(null);
    const [isSending, setIsSending] = useState(false);
    const [abortController, setAbortController] = useState(null);
    
    const fileInputRef = useRef(null);
    const { sendMessages } = useChatStore();

    const handleMediaChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const isImage = file.type.startsWith("image/");
        const isVideo = file.type.startsWith("video/");
        if (!isImage && !isVideo) {
            alert("Please select a valid image or video file.");
            return;
        }

        setMediaType(isImage ? "image" : "video");
        const reader = new FileReader();
        reader.onloadend = () => setMediaPreview(reader.result);
        reader.readAsDataURL(file);
    };

    const removeMedia = () => {
        setMediaPreview(null);
        setMediaType(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!text.trim() && !mediaPreview) return;

        setIsSending(true);
        const controller = new AbortController();
        setAbortController(controller);

        try {
            console.log("before sending message");
            await sendMessages(
                {
                    text: text.trim(),
                    media: mediaPreview,
                    mediaType,
                },
                controller.signal
            );
            console.log("after sending message");
            setText("");
            setMediaPreview(null);
            setMediaType(null);
            if (fileInputRef.current) fileInputRef.current.value = "";

            
        } catch (e) {
            if (e.name === "AbortError") {
                console.log("Message sending canceled.");
            } else {
                alert("Failed to send the message.");
                console.error(e);
            }
        } finally {
            setIsSending(false);
            setAbortController(null);
        }
    };

    const cancelSending = () => {
        if (abortController) abortController.abort();
        setIsSending(false);
        setMediaPreview(null);
        setMediaType(null);
        setText("");
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    return (
        <div className="p-4 w-full">
            {mediaPreview && (
                <div className="mb-3 flex items-center gap-2">
                    <div className="relative">
                        {mediaType === "image" ? (
                            <img
                                src={mediaPreview}
                                alt="Preview"
                                className="w-20 h-20 object-cover rounded-lg border-zinc-700"
                            />
                        ) : (
                            <video
                                src={mediaPreview}
                                controls
                                className="w-32 h-32 object-cover rounded-lg border-zinc-700"
                            />
                        )}
                        <button
                            onClick={removeMedia}
                            className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300 flex items-center justify-center"
                            type="button"
                            aria-label="Remove media"
                        >
                            <X className="size-3" />
                        </button>
                    </div>
                </div>
            )}
            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                <div className="flex-1 flex gap-2 items-center">
                    <input
                        type="text"
                        className="w-full input input-bordered rounded-lg input-sm sm:input-md"
                        placeholder="Type a message here!"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />
                    <input
                        type="file"
                        accept="image/*,video/*"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleMediaChange}
                    />
                    <button
                        type="button"
                        className={`btn btn-circle ${
                            mediaPreview ? "text-emerald-500" : "text-black-400"
                        }`}
                        onClick={() => fileInputRef.current?.click()}
                        aria-label="Attach media"
                    >
                        <Image size={20} />
                    </button>
                </div>
                <button
                    type="submit"
                    className="btn btn-sm btn-circle"
                    disabled={isSending || (!text.trim() && !mediaPreview)}
                >
                    {isSending ? (
                        <Loader size={22} className="animate-spin text-blue-500" />
                    ) : (
                        <Send size={22} />
                    )}
                </button>
                {/* {isSending && (
                    <button
                        type="button"
                        onClick={cancelSending}
                        className="btn btn-sm btn-circle text-red-500"
                        aria-label="Cancel sending"
                    >
                        Cancel
                    </button>
                )} */}
            </form>
        </div>
    );
};

export default MessageInput;
