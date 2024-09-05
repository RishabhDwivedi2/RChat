"use client"
import {
    Bird,
    CornerDownLeft,
    Mic,
    MoonIcon,
    Paperclip,
    Rabbit,
    Settings,
    SunIcon,
    Turtle,
    X,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
    Tooltip,
    TooltipProvider,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import { useState, useRef, useEffect } from "react"

export function Chatbot() {
    const [messages, setMessages] = useState<
        { role: string; content: string; files?: File[] }[]
    >([
        { role: "assistant", content: "Hello! How can I assist you today?" },
    ]);

    const [inputMessage, setInputMessage] = useState("");
    const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
    const [isSendDisabled, setIsSendDisabled] = useState(true);
    const [chatAreaHeight, setChatAreaHeight] = useState("470px");
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        if (attachedFiles.length > 0) {
            setChatAreaHeight("380px");
        } else {
            setChatAreaHeight("470px");
        }
    }, [attachedFiles]);

    useEffect(() => {
        if (inputMessage.trim()) {
            setIsSendDisabled(false);
        } else {
            setIsSendDisabled(true);
        }
    }, [inputMessage]);

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        files.forEach((file) => {
            console.log(`File Name: ${file.name}, File Size: ${file.size}, File Type: ${file.type}`);
        });
        setAttachedFiles((prevFiles) => [...prevFiles, ...files]);
    };

    const handleSendMessage = async (e: React.FormEvent | React.KeyboardEvent) => {
        e.preventDefault();

        if (inputMessage.trim()) {
            const newUserMessage = { role: "user", content: inputMessage, files: attachedFiles };
            setMessages((prevMessages) => [...prevMessages, newUserMessage]);

            try {
                const formData = new FormData();
                formData.append("message", inputMessage);

                if (attachedFiles.length > 0) {
                    attachedFiles.forEach((file) => {
                        formData.append("files", file);
                    });
                }

                setInputMessage("");
                setAttachedFiles([]);

                const response = await fetch("/api/chat", {
                    method: "POST",
                    body: formData,
                });

                const data = await response.json();
                const assistantMessage = { role: "assistant", content: data.text };

                setMessages((prevMessages) => [...prevMessages, assistantMessage]);
            } catch (error) {
                console.error("Error fetching assistant message:", error);
                setMessages((prevMessages) => [
                    ...prevMessages,
                    { role: "assistant", content: "Something went wrong. Please try again." },
                ]);
            }
        } else {
            console.warn("Cannot send without a message.");
        }
    };

    const handleFileDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const files = Array.from(e.dataTransfer.files);
        setAttachedFiles((prevFiles) => [...prevFiles, ...files]);
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        const files: File[] = [];
        const items = Array.from(e.clipboardData.items);

        for (const item of items) {
            if (item.kind === "file") {
                const file = item.getAsFile();
                if (file) files.push(file);
            }
        }
        setAttachedFiles((prevFiles) => [...prevFiles, ...files]);
    };

    const removeFile = (index: number) => {
        setAttachedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage(e);
        }
    };

    const chats = [
        { id: 1, title: "How to Write a 300-Word Paragraph" },
        { id: 2, title: "Understanding the Capital of Israel" },
        { id: 3, title: "Tips for Effective Time Management" },
        { id: 4, title: "Discussion on AI and Future Technology" },
        { id: 5, title: "Best Practices for Coding in JavaScript" },
        { id: 6, title: "Exploring Historical Events of World War II" },
        { id: 7, title: "A Guide to Healthy Eating and Exercise" },
        { id: 8, title: "The Impact of Climate Change on Global Economy" },
        { id: 9, title: "How to Improve Communication Skills" },
        { id: 10, title: "Understanding Cryptocurrency and Blockchain" },
        { id: 11, title: "The Role of Art in Modern Society" },
        { id: 12, title: "A Beginner's Guide to Yoga and Meditation" },
    ];
    
    return (
        <TooltipProvider>
            <div className="grid h-screen w-full font-poppins">

                <div className="flex flex-col">
                    <header className="sticky top-0 z-10 flex h-[57px] items-center gap-1 border-b bg-background px-4">
                        <h1 className="text-xl font-semibold">Playground</h1>
                        <Drawer>
                            <DrawerTrigger asChild>
                                <Button variant="ghost" size="icon" className="md:hidden">
                                    <Settings className="size-4" />
                                    <span className="sr-only">Settings</span>
                                </Button>
                            </DrawerTrigger>
                            <DrawerContent className="max-h-[80vh]">
                                <DrawerHeader>
                                    <DrawerTitle>Configuration</DrawerTitle>
                                    <DrawerDescription>
                                        Configure the settings for the model and messages.
                                    </DrawerDescription>
                                </DrawerHeader>
                                <form className="grid w-full items-start gap-6 overflow-auto p-4 pt-0">
                                    <fieldset className="grid gap-6 rounded-lg border p-4">
                                        <legend className="-ml-1 px-1 text-sm font-medium">
                                            Settings
                                        </legend>
                                        <div className="grid gap-3">
                                            <Label htmlFor="model">Model</Label>
                                            <Select>
                                                <SelectTrigger
                                                    id="model"
                                                    className="items-start [&_[data-description]]:hidden"
                                                >
                                                    <SelectValue placeholder="Select a model" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="genesis">
                                                        <div className="flex items-start gap-3 text-muted-foreground">
                                                            <Rabbit className="size-5" />
                                                            <div className="grid gap-0.5">
                                                                <p>
                                                                    Neural{" "}
                                                                    <span className="font-medium text-foreground">
                                                                        Genesis
                                                                    </span>
                                                                </p>
                                                                <p className="text-xs" data-description>
                                                                    Our fastest model for general use cases.
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </SelectItem>
                                                    <SelectItem value="explorer">
                                                        <div className="flex items-start gap-3 text-muted-foreground">
                                                            <Bird className="size-5" />
                                                            <div className="grid gap-0.5">
                                                                <p>
                                                                    Neural{" "}
                                                                    <span className="font-medium text-foreground">
                                                                        Explorer
                                                                    </span>
                                                                </p>
                                                                <p className="text-xs" data-description>
                                                                    Performance and speed for efficiency.
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </SelectItem>
                                                    <SelectItem value="quantum">
                                                        <div className="flex items-start gap-3 text-muted-foreground">
                                                            <Turtle className="size-5" />
                                                            <div className="grid gap-0.5">
                                                                <p>
                                                                    Neural{" "}
                                                                    <span className="font-medium text-foreground">
                                                                        Quantum
                                                                    </span>
                                                                </p>
                                                                <p className="text-xs" data-description>
                                                                    The most powerful model for complex
                                                                    computations.
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="grid gap-3">
                                            <Label htmlFor="temperature">Temperature</Label>
                                            <Input id="temperature" type="number" placeholder="0.4" />
                                        </div>
                                        <div className="grid gap-3">
                                            <Label htmlFor="top-p">Top P</Label>
                                            <Input id="top-p" type="number" placeholder="0.7" />
                                        </div>
                                        <div className="grid gap-3">
                                            <Label htmlFor="top-k">Top K</Label>
                                            <Input id="top-k" type="number" placeholder="0.0" />
                                        </div>
                                    </fieldset>
                                    <fieldset className="grid gap-6 rounded-lg border p-4">
                                        <legend className="-ml-1 px-1 text-sm font-medium">
                                            Messages
                                        </legend>
                                        <div className="grid gap-3">
                                            <Label htmlFor="role">Role</Label>
                                            <Select defaultValue="system">
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a role" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="system">System</SelectItem>
                                                    <SelectItem value="user">User</SelectItem>
                                                    <SelectItem value="assistant">Assistant</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="grid gap-3">
                                            <Label htmlFor="content">Content</Label>
                                            <Textarea id="content" placeholder="You are a..." />
                                        </div>
                                    </fieldset>
                                </form>
                            </DrawerContent>
                        </Drawer>
                    </header>
                    <main className="grid flex-1 gap-4 overflow-auto p-4 md:grid-cols-2 lg:grid-cols-3">
                        <div
                            className="relative hidden flex-col items-start gap-8 md:flex" x-chunk="dashboard-03-chunk-0"
                        >
                            <form className="grid w-full items-start gap-6">
                                <fieldset className="grid gap-6 rounded-lg border p-4">
                                    <legend className="-ml-1 px-1 text-sm font-medium">Theme</legend>

                                    <div className="grid gap-3">
                                        <Select>
                                            <SelectTrigger id="theme" className="items-start [&_[data-description]]:hidden">
                                                <SelectValue placeholder="Select a theme" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="dark">
                                                    <div className="flex items-start gap-3 text-muted-foreground">
                                                        <MoonIcon className="size-5" />
                                                        <div className="grid gap-0.5">
                                                            <p>
                                                                <span className="font-medium text-foreground">Dark Theme</span>
                                                            </p>
                                                            <p className="text-xs" data-description>
                                                                Perfect for low-light environments.
                                                            </p>
                                                        </div>
                                                    </div>
                                                </SelectItem>
                                                <SelectItem value="light">
                                                    <div className="flex items-start gap-3 text-muted-foreground">
                                                        <SunIcon className="size-5" />
                                                        <div className="grid gap-0.5">
                                                            <p>
                                                                <span className="font-medium text-foreground">Light Theme</span>
                                                            </p>
                                                            <p className="text-xs" data-description>
                                                                Bright and clear for daytime use.
                                                            </p>
                                                        </div>
                                                    </div>
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </fieldset>

                                <fieldset className="grid gap-6 rounded-lg border p-4">
                                    <legend className="-ml-1 px-1 text-sm font-medium">Chat History</legend>
                                    <div className="grid gap-3 max-h-[450px] overflow-y-auto">
                                        {chats.map((chat) => (
                                            <div
                                                key={chat.id}
                                                className="relative flex justify-between items-center border-b py-2 px-2 hover:bg-muted cursor-pointer group"
                                            >
                                                <span className="text-sm">{chat.title}</span>

                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <DotsHorizontalIcon className="h-5 w-5" />
                                                        </button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent>
                                                        <DropdownMenuItem onSelect={() => alert(`Share ${chat.title}`)}>
                                                            Share
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onSelect={() => alert(`Delete ${chat.title}`)}
                                                        >
                                                            Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        ))}
                                    </div>
                                </fieldset>
                            </form>
                        </div>
                        {/* Chat Area */}
                        <div className="relative flex h-full min-h-[50vh] flex-col rounded-xl bg-muted/50 p-4 lg:col-span-2"
                            onDrop={handleFileDrop}
                            onDragOver={(e) => e.preventDefault()}
                            onPaste={handlePaste}
                        >
                            <div className="chat-area flex-1 overflow-y-auto max-h-[470px] mb-4 p-3" style={{ maxHeight: chatAreaHeight }}>
                                {messages.map((message, index) => (
                                    <div
                                        key={index}
                                        className={`mb-4 ${message.role === "user" ? "text-right" : "text-left"}`}
                                    >
                                        {message.role === "user" && message.files && message.files.length > 0 && (
                                            <div className="flex flex-wrap justify-end gap-2 mb-2">
                                                {message.files.map((file, fileIndex) => (
                                                    <div key={fileIndex} className="relative group">
                                                        <div className="w-20 h-20 border rounded-lg overflow-hidden flex items-center justify-center bg-gray-100">
                                                            {file.type.startsWith("image/") ? (
                                                                <img
                                                                    src={URL.createObjectURL(file)}
                                                                    alt={file.name}
                                                                    className="max-w-full max-h-full object-cover"
                                                                />
                                                            ) : (
                                                                <span className="text-xs text-center p-1">{file.name}</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        <span
                                            className={`inline-block p-2 rounded-lg ${message.role === "user"
                                                ? "bg-blue-500 text-white"
                                                : "bg-gray-200 text-black"
                                                }`}
                                        >
                                            {message.content}
                                        </span>
                                    </div>
                                ))}
                            </div>


                            {/* Display attached files */}
                            {attachedFiles.length > 0 && (
                                <div className="mb-4 flex flex-wrap gap-2">
                                    {attachedFiles.map((file, index) => (
                                        <div key={index} className="relative group">
                                            <div className="w-20 h-20 border rounded-lg overflow-hidden flex items-center justify-center bg-gray-100">
                                                {file.type.startsWith("image/") ? (
                                                    <img
                                                        src={URL.createObjectURL(file)}
                                                        alt={file.name}
                                                        className="max-w-full max-h-full object-cover"
                                                    />
                                                ) : (
                                                    <span className="text-xs text-center p-1">{file.name}</span>
                                                )}
                                            </div>
                                            <button
                                                onClick={() => removeFile(index)}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Chat form */}
                            <form onSubmit={handleSendMessage} className="vibrant-chat-form relative overflow-hidden rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring">
                                <Label htmlFor="message" className="sr-only">Message</Label>
                                <Textarea
                                    id="message"
                                    placeholder="Type your message here..."
                                    className="min-h-12 resize-none border-0 p-3 shadow-none focus-visible:ring-0"
                                    value={inputMessage}
                                    onChange={(e) => setInputMessage(e.target.value)}
                                    onKeyDown={handleKeyDown} // Handle Enter key press
                                />

                                <div className="flex items-center p-3 pt-0">
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()}>
                                                <Paperclip className="size-4" />
                                                <span className="sr-only">Attach file</span>
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent side="top">Attach File</TooltipContent>
                                    </Tooltip>

                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                                <Mic className="size-4" />
                                                <span className="sr-only">Use Microphone</span>
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent side="top">Use Microphone</TooltipContent>
                                    </Tooltip>

                                    <Button type="submit" size="sm" className="ml-auto gap-1.5" disabled={isSendDisabled}>
                                        Send Message
                                        <CornerDownLeft className="size-3.5" />
                                    </Button>
                                </div>
                            </form>

                            {/* Hidden file input */}
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                multiple
                                onChange={handleFileInput}
                            />
                        </div>

                    </main>
                </div>
            </div>
        </TooltipProvider>
    )
}
