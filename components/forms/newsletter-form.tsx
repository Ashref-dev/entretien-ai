"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";

const FormSchema = z.object({
  email: z.string().email({
    message: "Enter a valid email.",
  }),
});

export function NewsletterForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    form.reset();
    toast({
      title: "Thanks for subscribing!",
      description: "You'll receive our next newsletter in your inbox.",
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="flex items-center space-x-2">
                  <Input
                    type="email"
                    className="rounded-md border-muted-foreground/20 bg-background/50 px-4 placeholder:text-muted-foreground/50 focus:border-primary"
                    placeholder="Enter your email"
                    {...field}
                  />
                  <Button 
                    type="submit" 
                    size="sm" 
                    className="rounded-full px-4 hover:bg-primary/90"
                  >
                    <Send className="mr-2 size-4" />
                    Subscribe
                  </Button>
                </div>
              </FormControl>
              <FormMessage className="mt-1.5 text-xs" />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
