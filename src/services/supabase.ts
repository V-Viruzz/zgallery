/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { SP_TABLET } from '@/static/static'
import { type FileType } from '@/type'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { type SupabaseClient, type User } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

export async function createServerClientHandle () {
  const cookieStore = cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get (name: string) {
          return cookieStore.get(name)?.value
        },
        set (name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options })
        },
        remove (name: string, options: CookieOptions) {
          cookieStore.set({ name, value: '', ...options })
        }
      }
    }
  )

  return supabase
}

export async function updateDataBaseList (params: { supabase: SupabaseClient, user: User | null, prevList: any, newFile: FileType, size: number }) {
  const { supabase, user, size, prevList, newFile } = params
  try {
    await supabase
      .from(SP_TABLET.PROFILES)
      .update({
        list_files: {
          image: [
            ...prevList,
            {
              ...newFile
            }
          ]
        },
        bucket_size: size
      })
      .eq('user_id', user?.id)
  } catch (error) {
    console.log(error)
  }
}

export async function getListFiles (supabase: SupabaseClient, user: User | null) {
  const { data: column } = await supabase
    .from(SP_TABLET.PROFILES)
    .select('list_files')
    .eq('user_id', user?.id)

  if (column === null) return []
  const prevList = column[0].list_files === null ? [] : column[0].list_files.image

  return prevList
}

export async function getBucketSize (supabase: SupabaseClient, user: User | null) {
  const { data: column } = await supabase
    .from(SP_TABLET.PROFILES)
    .select('bucket_size')
    .eq('user_id', user?.id)

  if (column === null) throw new Error('error column not found')
  const prevSize = column[0].bucket_size

  return prevSize
}

export async function deleteFile (fileName: string, fileType: 'image' | 'video') {
  try {
    const supabase = await createServerClientHandle()
    const { data: { user } } = await supabase.auth.getUser()

    const getPrevList = async (user: User | null) => {
      const { data: column } = await supabase
        .from(SP_TABLET.PROFILES)
        .select('list_files')
        .eq('user_id', user?.id)

      if (column === null) return []
      const prevList: File[] = column[0].list_files === null ? [] : column[0].list_files.image

      return prevList
    }
    const prevList = await getPrevList(user)

    const newList = prevList.filter(item => item.name !== fileName)

    await supabase
      .from(SP_TABLET.PROFILES)
      .update({
        list_files: {
          image: [
            ...newList
          ]
        }
      })
      .eq('user_id', user?.id)

    if (fileType === 'image') {
      const { data, error } = await supabase.storage
        .from('image')
        .remove([`${user?.id}/${fileName}`])

      if (error !== null) return { data: null, error }
      return { data, error: null }
    } else {
      const { data, error } = await supabase.storage
        .from('video')
        .remove([
        `${user?.id}/${fileName}/${fileName}`,
        `${user?.id}/${fileName}/video_thumbnail.png`,
        `${user?.id}/${fileName}`
        ])

      if (error !== null) return { data: null, error }
      return { data, error: null }
    }
  } catch (error) {
    console.log(error)
    return { data: null, error }
  }
}

export async function favoriteFile (fileName: string, favorite: string) {
  try {
    const supabase = await createServerClientHandle()
    const { data: { user } } = await supabase.auth.getUser()

    const getPrevList = async (user: User | null) => {
      const { data: column } = await supabase
        .from(SP_TABLET.PROFILES)
        .select('list_files')
        .eq('user_id', user?.id)

      if (column === null) return []
      const prevList: FileType[] = column[0].list_files === null ? [] : column[0].list_files.image

      return prevList
    }
    const prevList = await getPrevList(user)

    const newFavorite = favorite === 'true'

    const newList = prevList.map((item) => {
      if (item.name === fileName) {
        return {
          ...item,
          favorite: newFavorite
        }
      }
      return item
    })

    await supabase
      .from(SP_TABLET.PROFILES)
      .update({
        list_files: {
          image: [
            ...newList
          ]
        }
      })
      .eq('user_id', user?.id)
  } catch (error) {
    console.log(error)
    return { data: null, error }
  }
}
