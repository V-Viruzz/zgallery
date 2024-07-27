'use client'
import FileContainer from '@/components/FileContainer'
import { SORT_TYPE } from '@/static/static'
import { type ExtendedFileType } from '@/type'
import { sortList } from '@/util/utils'
import { useEffect, useState } from 'react'
import Loading from './loading'

interface Props {
  searchParams: {
    name: string
    sort: string
  }
}

const DOMAIN_URL = process.env.NEXT_PUBLIC_DOMAIN_URL

async function getImages (): Promise<ExtendedFileType[]> {
  const apiUrl = `${DOMAIN_URL}/api/image`

  const res = await fetch(apiUrl, {
    method: 'GET',
    cache: 'no-store'
  })
  const result = await res.json()
  return result.list as ExtendedFileType[]
}

export default function page ({ searchParams }: Props) {
  const [list, setList] = useState<ExtendedFileType[]>([])
  const { name, sort } = searchParams

  useEffect(() => {
    getImages()
      .then(res => {
        let newList = res

        if (name !== undefined) {
          newList = list.filter(img => img.name.includes(name))
        }

        if (sort !== undefined) {
          if (
            sort !== SORT_TYPE.RECENT &&
            sort !== SORT_TYPE.RECENT_INVERT &&
            sort !== SORT_TYPE.A_Z &&
            sort !== SORT_TYPE.Z_A
          ) return

          newList = sortList(res, sort)
        }

        setList(newList)
      })
  }, [name, sort])

  return (
    <>
      {
        list.length === 0
          ? <Loading/>
          : <FileContainer list={list} />
      }
    </>
  )
}
