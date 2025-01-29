"use client"
import supabase from "@/utils/supabase";
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from "@supabase/auth-ui-shared";

export default function Google() {
    return <div>
        <Auth
            supabaseClient={supabase}
            appearance={{ theme: ThemeSupa }}
            providers={['google']}
        />
    </div>
}