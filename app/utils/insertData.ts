'use server'

import { createClient } from "./supabase/server"
import { Track } from "@/types";

export async function insertData (title: string, tracks: Track[]) {
    const text = tracks.map(t => t.texts).join("\n@end\n")

    const supabase = await createClient()
    const { error } = await supabase
        .from('Songs')
        .insert({
            text: text,
            author: "key_mon",
            title: title
        })

    if (error) {
        console.error("supabase database error")
        console.log(error)
    }
}