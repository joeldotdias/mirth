"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { updateProfile } from "@/app/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const formSchema = z.object({
    username: z.string().min(1).max(150),
    bio: z.string().refine((b) => b.split(" ").length <= 25, {
        message: "Your bio must be less than 25 words",
    }),
});

export default function UpdateProfileForm({
    username,
    bio,
}: {
    username: string;
    bio: string;
}) {
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: username,
            bio: bio,
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await updateProfile(values.username, values.bio);
            router.push("/profile");
            toast("Updated your bio 🎉");
        } catch (err) {
            toast.error(err as string);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormDescription>
                                How others see you
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Bio</FormLabel>
                            <FormControl>
                                <Textarea className="resize-none" {...field} />
                            </FormControl>
                            <FormDescription>
                                Tell us about yourself
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex justify-center">
                    <Button type="submit">Save</Button>
                </div>
            </form>
        </Form>
    );
}
