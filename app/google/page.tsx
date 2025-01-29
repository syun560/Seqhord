"use client"
import { createClient } from "@/utils/supabase/client"
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from "@supabase/auth-ui-shared";

export default function Google() {
    const supabase = createClient()

    return <div>
        <Auth
            supabaseClient={supabase}
            appearance={{ theme: ThemeSupa }}
            providers={['google']}
        />
    </div>
}