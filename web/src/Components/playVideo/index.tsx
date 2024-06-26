import { useEffect, useState, useCallback } from 'react'
import { Pagination } from '@mui/material'
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Accordiondiv, Herosection } from './styles'
import { listarArquivos, endpoint } from '../listarArquivos'
import ReactPlayer from 'react-player'

interface Arquivo {
  Key: string | undefined
}

export const PlayVideo = () => {
  const [arquivos, setArquivos] = useState<Arquivo[]>([])
  const [openedIndex, setOpenedIndex] = useState<number | null>(null)
  const bucketName = 'test'

  const fetchData = useCallback(async () => {
    const files = await listarArquivos(bucketName)
    setArquivos(files)
  }, [bucketName])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleAccordionChange = (index: number) => {
    setOpenedIndex(openedIndex === index ? null : index)
  }

  return (
    <Herosection className="container">
      <Pagination
        count={7}
        color="primary"
        hidePrevButton
        hideNextButton
        size="large"
      />

      <Accordiondiv>
        {arquivos.map((file, index) => (
          <Accordion
            key={file.Key || index}
            expanded={openedIndex === index}
            onChange={() => handleAccordionChange(index)}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`panel${index}-content`}
              id={`panel${index}-header`}
              className="text"
            >
              {file.Key || 'Arquivo sem nome'}
            </AccordionSummary>
            <AccordionDetails className="Player">
              {openedIndex === index && file.Key ? (
                <ReactPlayer
                  url={`${endpoint}/${bucketName}/${file.Key}`}
                  controls
                  onError={() => console.log('Erro ao carregar o vídeo')}
                />
              ) : openedIndex === index ? (
                <div>Arquivo sem chave definida</div>
              ) : null}
            </AccordionDetails>
          </Accordion>
        ))}
      </Accordiondiv>
    </Herosection>
  )
}
