import { createClient, SupabaseClient } from '@supabase/supabase-js'

export type Tables = 'products' | 'posts' | 'customers' | 'inventory' | 'orders'

let client: SupabaseClient | null = null

export function getSupabase(): SupabaseClient | null {
	const url = process.env.SUPABASE_URL
	const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY
	if (!url || !key) return null
	if (!client) client = createClient(url, key)
	return client
}

export async function supabaseSelectAll<T>(table: Tables): Promise<T[] | null> {
	const supabase = getSupabase()
	if (!supabase) return null
	const { data, error } = await supabase.from(table).select('*')
	if (error) {
		console.error(`[supabase] select ${table} error`, error)
		return null
	}
	return (data as T[]) || []
}

export async function supabaseSelectOne<T extends { id: string }>(table: Tables, id: string): Promise<T | null> {
	const supabase = getSupabase()
	if (!supabase) return null
	const { data, error } = await supabase.from(table).select('*').eq('id', id).single()
	if (error) {
		console.error(`[supabase] select ${table} by id ${id} error`, error)
		return null
	}
	return (data as T) || null
}

export async function supabaseSelectByField<T>(table: Tables, field: string, value: string): Promise<T | null> {
	const supabase = getSupabase()
	if (!supabase) return null
	const { data, error } = await supabase.from(table).select('*').eq(field, value).single()
	if (error) {
		console.error(`[supabase] select ${table} by ${field} ${value} error`, error)
		return null
	}
	return (data as T) || null
}

export async function supabaseUpsertMany<T extends { id: string }>(table: Tables, rows: T[]): Promise<boolean> {
	const supabase = getSupabase()
	if (!supabase) return false
	const { error } = await supabase.from(table).upsert(rows, { onConflict: 'id' })
	if (error) {
		console.error(`[supabase] upsert ${table} error`, error)
		return false
	}
	return true
}

export async function supabaseDeleteMany(table: Tables, ids: string[]): Promise<boolean> {
	const supabase = getSupabase()
	if (!supabase || ids.length === 0) return true
	const { error } = await supabase.from(table).delete().in('id', ids)
	if (error) {
		console.error(`[supabase] delete ${table} error`, error)
		return false
	}
	return true
}
