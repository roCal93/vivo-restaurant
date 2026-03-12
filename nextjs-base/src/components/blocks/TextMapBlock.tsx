'use client'

import React, { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { StrapiBlock, StrapiMedia } from '@/types/strapi'

type TextMapBlockProps = {
  title?: string
  content: StrapiBlock[]
  address?: string
  latitude?: number | null
  longitude?: number | null
  zoom?: number
  showMarker?: boolean
  showItineraryLink?: boolean
  itineraryLinkLabel?: string
  markerImage?: StrapiMedia | null
  showOpeningHours?: boolean
  openingHoursTitle?: string
  openingHoursClosedLabel?: string
  openingHoursFirstPeriodLabel?: string
  openingHoursSecondPeriodLabel?: string
  // Backward compatibility for old field names
  openingHoursLunchLabel?: string
  openingHoursDinnerLabel?: string
  openingDays?: Array<{
    dayLabel: string
    isClosedAllDay?: boolean | null
    firstPeriodOpenTime?: string | null
    firstPeriodCloseTime?: string | null
    secondPeriodOpenTime?: string | null
    secondPeriodCloseTime?: string | null
    // Backward compatibility for old field names
    lunchOpenTime?: string | null
    lunchCloseTime?: string | null
    dinnerOpenTime?: string | null
    dinnerCloseTime?: string | null
  }>
}

// helper that turns phone numbers and email addresses into clickable links
const parseTextWithLinks = (text: string): React.ReactNode[] => {
  // capture either a phone-like sequence or an email
  const regex =
    /(\+?\d[\d\s\-\(\)]{5,}\d)|([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g
  const nodes: React.ReactNode[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null
  while ((match = regex.exec(text)) !== null) {
    const start = match.index
    const raw = match[0]
    if (start > lastIndex) {
      nodes.push(text.slice(lastIndex, start))
    }
    if (match[1]) {
      // phone
      const tel = raw.replace(/[\s\-\(\)]/g, '')
      nodes.push(
        <a
          key={start}
          href={`tel:${tel}`}
          className="no-underline hover:underline decoration-[0.5px] underline-offset-2"
        >
          {raw}
        </a>
      )
    } else if (match[2]) {
      // email
      nodes.push(
        <a
          key={start}
          href={`mailto:${raw}`}
          className="no-underline hover:underline decoration-[0.5px] underline-offset-2"
        >
          {raw}
        </a>
      )
    }
    lastIndex = start + raw.length
  }
  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex))
  }
  return nodes
}

const renderBlocks = (blocks: StrapiBlock[]) => {
  return blocks.map((block, index) => {
    switch (block.type) {
      case 'paragraph':
        return (
          <p key={index} className="text-[var(--foreground)] mb-4">
            {block.children?.map((child, childIndex) => (
              <span key={childIndex}>
                {parseTextWithLinks(child.text || '')}
              </span>
            ))}
          </p>
        )
      case 'heading': {
        const level = block.level || 2
        const children = block.children?.map((child, childIndex) => (
          <span key={childIndex}>{parseTextWithLinks(child.text || '')}</span>
        ))
        switch (level) {
          case 1:
            return (
              <h1 key={index} className="font-bold mb-4 text-4xl">
                {children}
              </h1>
            )
          case 2:
            return (
              <h2 key={index} className="font-bold mb-4 text-3xl">
                {children}
              </h2>
            )
          case 3:
            return (
              <h3 key={index} className="font-bold mb-4 text-2xl">
                {children}
              </h3>
            )
          case 4:
            return (
              <h4 key={index} className="font-bold mb-4 text-xl">
                {children}
              </h4>
            )
          case 5:
            return (
              <h5 key={index} className="font-bold mb-4 text-lg">
                {children}
              </h5>
            )
          default:
            return (
              <h6 key={index} className="font-bold mb-4 text-base">
                {children}
              </h6>
            )
        }
      }
      case 'list': {
        const ListTag = block.format === 'ordered' ? 'ol' : 'ul'
        return (
          <ListTag key={index} className="ml-6 mb-4 list-disc">
            {block.children?.map((child, childIndex) => (
              <li key={childIndex} className="mb-2">
                {Array.isArray(child.children) &&
                  child.children.map(
                    (gc: { type: string; text?: string }, gci: number) => (
                      <span key={gci}>{parseTextWithLinks(gc.text || '')}</span>
                    )
                  )}
              </li>
            ))}
          </ListTag>
        )
      }
      default:
        return null
    }
  })
}

// Leaflet map using raw API — avoids react-leaflet MapContainer lifecycle bug
type LeafletMapProps = {
  lat: number
  lng: number
  zoom: number
  showMarker: boolean
  popupText?: string
  markerImageUrl?: string
}

const LeafletMap = ({
  lat,
  lng,
  zoom,
  showMarker,
  popupText,
  markerImageUrl,
}: LeafletMapProps) => {
  const divRef = useRef<HTMLDivElement>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapRef = useRef<any>(null)

  useEffect(() => {
    if (!divRef.current) return

    import('leaflet').then((L) => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }

      const map = L.map(divRef.current!).setView([lat, lng], zoom)

      L.tileLayer(
        'https://data.geopf.fr/wmts?' +
          'SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0' +
          '&LAYER=GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2' +
          '&STYLE=normal&FORMAT=image/png' +
          '&TILEMATRIXSET=PM&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}',
        {
          attribution: '&copy; <a href="https://www.ign.fr/">IGN-France</a>',
          minZoom: 2,
          maxZoom: 18,
        }
      ).addTo(map)

      if (showMarker) {
        if (markerImageUrl) {
          const icon = L.icon({
            iconUrl: markerImageUrl,
            iconSize: [40, 40],
            iconAnchor: [20, 40],
            popupAnchor: [0, -40],
          })
          const marker = L.marker([lat, lng], { icon }).addTo(map)
          if (popupText) marker.bindPopup(popupText)
        } else {
          const marker = L.circleMarker([lat, lng], {
            radius: 8,
            color: '#2563eb',
            fillColor: '#2563eb',
            fillOpacity: 1,
          }).addTo(map)
          if (popupText) marker.bindPopup(popupText)
        }
      }

      mapRef.current = map
    })

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [lat, lng, zoom, showMarker, popupText, markerImageUrl])

  return <div ref={divRef} style={{ height: '100%', width: '100%' }} />
}

// Main block
const TextMapBlock = ({
  title,
  content,
  address,
  latitude,
  longitude,
  zoom = 15,
  showMarker = true,
  showItineraryLink = true,
  itineraryLinkLabel = 'Ouvrir dans Maps',
  markerImage,
  showOpeningHours = false,
  openingHoursTitle = 'Horaires',
  openingHoursClosedLabel = 'Fermé',
  openingHoursFirstPeriodLabel,
  openingHoursSecondPeriodLabel,
  openingHoursLunchLabel,
  openingHoursDinnerLabel,
  openingDays = [],
}: TextMapBlockProps) => {
  const firstPeriodLabel =
    openingHoursFirstPeriodLabel ?? openingHoursLunchLabel ?? 'Service 1'
  const secondPeriodLabel =
    openingHoursSecondPeriodLabel ?? openingHoursDinnerLabel ?? 'Service 2'

  const shouldReduce = useReducedMotion()
  const [coords, setCoords] = useState<[number, number] | null>(
    latitude && longitude ? [latitude, longitude] : null
  )
  const [loadingGeo, setLoadingGeo] = useState(false)
  const [geoError, setGeoError] = useState<string | null>(null)

  useEffect(() => {
    if (latitude && longitude) {
      setCoords([latitude, longitude])
      return
    }

    if (!address) return

    let mounted = true
    const fetchGeo = async () => {
      try {
        setLoadingGeo(true)
        setGeoError(null)
        const res = await fetch(
          'https://nominatim.openstreetmap.org/search?format=json&q=' +
            encodeURIComponent(address) +
            '&limit=1'
        )
        const json = await res.json()
        if (!mounted) return
        if (Array.isArray(json) && json.length > 0) {
          setCoords([parseFloat(json[0].lat), parseFloat(json[0].lon)])
        } else {
          setGeoError('Adresse non trouvée')
        }
      } catch {
        setGeoError('Erreur de géocodage')
      } finally {
        setLoadingGeo(false)
      }
    }

    fetchGeo()
    return () => {
      mounted = false
    }
  }, [address, latitude, longitude])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-8">
      <motion.div
        className="prose max-w-none text-[var(--foreground)] pr-4 md:pr-8"
        initial={shouldReduce ? {} : { opacity: 0, x: -60 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={
          shouldReduce ? { duration: 0 } : { duration: 0.7, ease: 'easeOut' }
        }
      >
        {title && <h3 className="text-2xl font-bold mb-14">{title}</h3>}
        {renderBlocks(content)}

        {showOpeningHours && openingDays.length > 0 && (
          <div className="mt-8 max-w-sm rounded-lg border border-gray-200/70 p-4">
            <h4 className="text-lg font-semibold mb-3">{openingHoursTitle}</h4>
            <ul className="space-y-2">
              {openingDays.map((entry, index) => {
                const firstOpen =
                  entry.firstPeriodOpenTime ?? entry.lunchOpenTime
                const firstClose =
                  entry.firstPeriodCloseTime ?? entry.lunchCloseTime
                const secondOpen =
                  entry.secondPeriodOpenTime ?? entry.dinnerOpenTime
                const secondClose =
                  entry.secondPeriodCloseTime ?? entry.dinnerCloseTime

                const firstRange =
                  firstOpen && firstClose
                    ? `${firstOpen} - ${firstClose}`
                    : null
                const secondRange =
                  secondOpen && secondClose
                    ? `${secondOpen} - ${secondClose}`
                    : null
                const isClosed = !!entry.isClosedAllDay

                return (
                  <li
                    key={`${entry.dayLabel}-${index}`}
                    className="flex items-start justify-between gap-4 text-sm"
                  >
                    <span className="font-medium">{entry.dayLabel}</span>
                    <span
                      className={`text-right ${isClosed ? 'opacity-80 italic' : ''}`}
                    >
                      {isClosed ? (
                        openingHoursClosedLabel
                      ) : (
                        <>
                          {firstRange && (
                            <span className="block">
                              <span className="opacity-70 mr-2">
                                {firstPeriodLabel}
                              </span>
                              {firstRange}
                            </span>
                          )}
                          {secondRange && (
                            <span className="block">
                              <span className="opacity-70 mr-2">
                                {secondPeriodLabel}
                              </span>
                              {secondRange}
                            </span>
                          )}
                          {!firstRange && !secondRange && '--'}
                        </>
                      )}
                    </span>
                  </li>
                )
              })}
            </ul>
          </div>
        )}
      </motion.div>

      <motion.div
        className="rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-900 h-64 md:h-96 relative md:mt-24"
        initial={shouldReduce ? {} : { opacity: 0, x: 60 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={
          shouldReduce
            ? { duration: 0 }
            : { duration: 0.7, delay: 0.2, ease: 'easeOut' }
        }
      >
        {!coords && loadingGeo && (
          <div className="h-full flex items-center justify-center text-sm text-gray-500">
            Chargement de la carte&#x2026;
          </div>
        )}

        {!coords && !loadingGeo && geoError && (
          <div className="h-full flex items-center justify-center text-sm text-red-500">
            {geoError}
          </div>
        )}

        {coords && (
          <>
            <LeafletMap
              lat={coords[0]}
              lng={coords[1]}
              zoom={zoom}
              showMarker={showMarker}
              popupText={address}
              markerImageUrl={
                markerImage?.url
                  ? markerImage.url.startsWith('/')
                    ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${markerImage.url}`
                    : markerImage.url
                  : undefined
              }
            />
            {showItineraryLink && (
              <a
                href={
                  'https://www.google.com/maps/dir/?api=1&destination=' +
                  coords[0] +
                  ',' +
                  coords[1]
                }
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-3 left-3 z-[1000] inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-gray-800 shadow-md hover:bg-gray-100 transition-colors"
                aria-label={itineraryLinkLabel}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 256 367"
                  className="w-5 h-5 shrink-0"
                  aria-hidden="true"
                >
                  <path
                    fill="#34a853"
                    d="M70.585 271.865a371 371 0 0 1 28.911 42.642c7.374 13.982 10.448 23.463 15.837 40.31c3.305 9.308 6.292 12.086 12.714 12.086c6.998 0 10.173-4.726 12.626-12.035c5.094-15.91 9.091-28.052 15.397-39.525c12.374-22.15 27.75-41.833 42.858-60.75c4.09-5.354 30.534-36.545 42.439-61.156c0 0 14.632-27.035 14.632-64.792c0-35.318-14.43-59.813-14.43-59.813l-41.545 11.126l-25.23 66.451l-6.242 9.163l-1.248 1.66l-1.66 2.078l-2.914 3.319l-4.164 4.163l-22.467 18.304l-56.17 32.432z"
                  />
                  <path
                    fill="#fbbc04"
                    d="M12.612 188.892c13.709 31.313 40.145 58.839 58.031 82.995l95.001-112.534s-13.384 17.504-37.662 17.504c-27.043 0-48.89-21.595-48.89-48.825c0-18.673 11.234-31.501 11.234-31.501l-64.489 17.28z"
                  />
                  <path
                    fill="#4285f4"
                    d="M166.705 5.787c31.552 10.173 58.558 31.53 74.893 63.023l-75.925 90.478s11.234-13.06 11.234-31.617c0-27.864-23.463-48.68-48.81-48.68c-23.969 0-37.735 17.475-37.735 17.475v-57z"
                  />
                  <path
                    fill="#1a73e8"
                    d="M30.015 45.765C48.86 23.218 82.02 0 127.736 0c22.18 0 38.89 5.823 38.89 5.823L90.29 96.516H36.205z"
                  />
                  <path
                    fill="#ea4335"
                    d="M12.612 188.892S0 164.194 0 128.414c0-33.817 13.146-63.377 30.015-82.649l60.318 50.759z"
                  />
                </svg>
                {itineraryLinkLabel}
              </a>
            )}
          </>
        )}
      </motion.div>
    </div>
  )
}

export default TextMapBlock
