import { useState, useEffect } from 'react'
import './App.css'
import axios from 'axios'
import Header from './components/Header'
import Footer from './components/Footer'
import Button from './components/Button'
import Tag from './components/Tag'
import BentoTab from './components/BentoTab'
// import { dummyData } from './data/dummy/dummy-data'
import { Copy, ChevronLast, ChevronFirst, ChevronLeft, ChevronRight } from 'lucide-react';
// import { FileUploader } from "react-drag-drop-files";

function App() {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
  
  const [urls, setUrls] = useState([])
  const [formData, setFormData] = useState({
    original_url: ''
  })
  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    total_pages: 1
  })
  
  // const fileTypes = ["CSV"];
  // const [file, setFile] = useState(null);

  // const handleFileChange = (file) => {
  //   setFile(file);
  //   // Process the uploaded file here (logic)
  // };

  const [selectedFile, setSelectedFile] = useState(null)

  useEffect(() => {
    fetchHistory()
  }, [pagination.page, pagination.limit])

  const downloadCSVTemplate = () => {
    const csvContent = "original_url\nhttps://example.com"
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', 'url-shortener-template.csv')
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const handleFileChange = (event) => {
    const file = event.target.files[0]
    if (file && file.type === 'text/csv') {
      setSelectedFile(file)
    } else {
      alert('Please select a valid CSV file.')
      event.target.value = ''
      setSelectedFile(null)
    }
  }

  const parseCSV = (csvText) => {
    const lines = csvText.split('\n')
    const headers = lines[0].split(',').map(header => header.trim().toLowerCase())
    
    if (!headers.includes('original_url')) {
      throw new Error('CSV file must contain "original_url" column')
    }
    
    const originalUrlIndex = headers.indexOf('original_url')
    const urls = []
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim()
      if (line) {
        const values = line.split(',')
        const url = values[originalUrlIndex]?.trim()
        if (url && url !== 'original_url') {
          urls.push(url)
        }
      }
    }
    
    return urls
  }

  const fetchHistory = async () => {
    try {
      const response = await axios.get(`${API_URL}/url-shortener/history`, {
        params: {
          page: pagination.page,
          limit: pagination.limit
        }
      })
      setUrls(response.data.items || [])
      setPagination(prev => ({
        ...prev,
        total: response.data.total || 0,
        total_pages: response.data.total_pages || 1
      }))
    } catch (error) {
      console.error('Error fetching history:', error)
    }
  }

  const createShortUrl = async (e) => {
    e.preventDefault()
    if (!formData.original_url.trim()) return
    
    setLoading(true)
    try {
      const response = await axios.post(`${API_URL}/url-shortener/`, {
        original_url: formData.original_url
      })
      setUrls([response.data, ...urls])
      setFormData({ original_url: '' })
      fetchHistory()
    } catch (error) {
      console.error('Error creating short URL:', error)
      alert('Failed to shorten URL. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const createMultipleShortUrl = async (e) => {
    e.preventDefault()
    
    if (!selectedFile) {
      alert('Please select a CSV file first.')
      return
    }
    
    setLoading(true)
    
    try {
      const fileContent = await new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = (e) => resolve(e.target.result)
        reader.onerror = (e) => reject(e)
        reader.readAsText(selectedFile)
      })
      
      const urlsFromCSV = parseCSV(fileContent)
      
      if (urlsFromCSV.length === 0) {
        alert('No valid URLs found in the CSV file.')
        return
      }
      
      const successfulUrls = []
      const failedUrls = []
      
      for (const url of urlsFromCSV) {
        try {
          const response = await axios.post(`${API_URL}/url-shortener/`, {
            original_url: url
          })
          successfulUrls.push(response.data)
        } catch (error) {
          console.error(`Failed to shorten URL: ${url}`, error)
          failedUrls.push(url)
        }
      }
      
      if (successfulUrls.length > 0) {
        setUrls([...successfulUrls, ...urls])
        fetchHistory()
      }
      
      if (failedUrls.length > 0) {
        alert(`Successfully shortened ${successfulUrls.length} URLs. Failed to shorten ${failedUrls.length} URLs.`)
      } else {
        alert(`Successfully shortened all ${successfulUrls.length} URLs!`)
      }
      
      setSelectedFile(null)
      
      const fileInput = document.getElementById('myfile')
      if (fileInput) {
        fileInput.value = ''
      }
      
    } catch (error) {
      console.error('Error processing CSV file:', error)
      alert('Failed to process CSV file. Please check the format and try again.')
    } finally {
      setLoading(false)
    }
  }

  const clearAll = async () => {
    if (!window.confirm('Are you sure you want to clear all URLs?')) return
    
    try {
      await axios.delete(`${API_URL}/url-shortener/history`)
      setUrls([])
      fetchHistory()
    } catch (error) {
      console.error('Error clearing all URLs:', error)
      alert('Failed to clear all URLs. Please try again.')
    }
  }

  const clearSingle = async (urlId) => {
    if (!window.confirm('Are you sure you want to delete this URL?')) return
    
    try {
      await axios.delete(`${API_URL}/url-shortener/history/${urlId}`)
      setUrls(urls.filter(url => url.id !== urlId))
      fetchHistory()
    } catch (error) {
      console.error('Error deleting URL:', error)
      alert('Failed to delete URL. Please try again.')
    }
  }

  const handleLimitChange = (newLimit) => {
    setPagination(prev => ({
      ...prev,
      limit: parseInt(newLimit),
      page: 1 
    }))
  }

  const goToPage = (page) => {
    if (page >= 1 && page <= pagination.total_pages) {
      setPagination(prev => ({
        ...prev,
        page: page
      }))
    }
  }

  const goToFirstPage = () => goToPage(1)
  const goToPreviousPage = () => goToPage(pagination.page - 1)
  const goToNextPage = () => goToPage(pagination.page + 1)
  const goToLastPage = () => goToPage(pagination.total_pages)

  const startItem = (pagination.page - 1) * pagination.limit + 1
  const endItem = Math.min(pagination.page * pagination.limit, pagination.total)

  return (
    <div className='w-full min-h-screen flex flex-col'>
      <Header />

      <main className='flex-1 flex flex-col lg:px-[120px] lg:py-[50px] lg:pt-[120px] space-y-[50px] px-[20px] py-[100px]'>
        <div className='flex flex-col space-y-[30px]'>
          <div className='flex flex-col space-y-[10px]'>
            <h1 className='text-[var(--color-primary)] font-bold'>Shorten your link</h1>

            <div className='items-center justify-center flex flex-row space-x-[10px]'>
                <Tag>Simple</Tag>
                <Tag>Fast</Tag>
                <Tag>Reliable</Tag>
            </div>
          </div>

          <div className='rounded-[10px] p-[10px] bg-[var(--color-primary)]'>
            <div>
              <BentoTab
                tabs={[
                  {
                    label: 'Single URL',
                    content: (
                      <div className='flex flex-col space-y-[10px]'>
                        <p className='p-body1 text-[var(--color-primary)] text-left'>Paste your link here:</p>

                        <div className='flex lg:flex-row flex-col space-y-[10px] space-x-0 lg:space-x-[10px] lg:space-y-0'>
                          <input
                            type="text"
                            placeholder='URL (eg:www.example.com)'
                            value={formData.original_url}
                            onChange={(e) => setFormData({...formData, original_url: e.target.value})}
                            className='flex-1 w-full p-[10px] rounded-[5px] border border-[var(--color-border)]'
                          />

                          <div className='w-full lg:w-auto'>
                            <Button
                              type="primary"
                              onClick={createShortUrl}
                              disabled={loading}
                              className='!w-full !text-center'
                            >
                              <div className='w-full'>
                                {loading ? 'Shortening...' : 'Shorten URL'}
                              </div>
                            </Button>
                          </div>
                        </div>
                      </div>
                    )
                  },
                  {
                    label: 'Multiple URL',
                    content: (
                      <div className='flex flex-col space-y-[20px]'>
                        <div className='flex flex-col space-y-[10px] lg:flex-row lg:space-x-[10px]'>
                          <div className='!align-middle !w-full flex-1 flex flex-col'>
                            <p className='w-full flex align-center p-body1 text-left'><b>Step 1:</b></p>

                            <p className='w-full flex align-center p-body1 text-left'>Download the .csv template and fill in the necessary details</p>
                          </div>

                          <div className='w-full lg:w-auto text-center'>
                            <Button
                              type="secondary"
                              onClick={downloadCSVTemplate}
                              className='!w-full lg:w-auto !text-center'
                            >
                              <div className='text-center w-full'>
                                <p className='text-center'>Download .csv Template</p>
                              </div>
                            </Button>
                          </div>
                        </div>

                        <div className='flex flex-col space-y-[10px] lg:flex-row lg:space-x-[10px]'>
                          <div className='!align-middle !w-full flex-1 flex flex-col'>
                            <p className='w-full flex align-center p-body1 text-left'><b>Step 2:</b></p>

                            <p className='w-full flex align-center p-body1 text-left'>Upload filled .csv file and click "Shorten URL"</p>
                          </div>

                          <div className='flex flex-col space-y-[5px]'>
                            <input 
                              type="file"
                              placeholder='Upload or drop a .csv file here'
                              id='myfile'
                              name='myfile'
                              accept='.csv'
                              onChange={handleFileChange}
                              className='flex-1 w-auto p-[10px] rounded-[5px] border border-[var(--color-border)]' 
                            />
                            {selectedFile && (
                              <p className='p-body2 text-[var(--color-text-secondary)]'>
                                Selected: {selectedFile.name}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className='w-full lg:w-auto'>
                          <Button
                            type="primary"
                            onClick={createMultipleShortUrl}
                            disabled={loading || !selectedFile}
                            className='!w-full !text-center'
                          >
                            <div className='w-full'>
                              {loading ? 'Processing...' : 'Shorten URLs'}
                            </div>
                          </Button>
                        </div>
                      </div>
                    )
                  }
                ]}
              />
            </div>
          </div>
        </div>

        <div className='w-full flex flex-col space-y-[20px]'>
          <div className='items-center flex flex-row space-x-[10px]'>
            <h2 className='text-[var(--color-primary)] text-left !w-full font-bold'>Recent History</h2>

            <Button
              type="link"
              onClick={clearAll}
              className='!text-red-500 whitespace-nowrap'
            >
              <p className='!w-full'>Clear all</p>
            </Button>
          </div>

          <div className='rounded-[10px] bg-[var(--color-primary)] p-[10px]'>
            <div className='w-full rounded-[10px] bg-white min-h-[200px]'>
              <div className='!overflow-x-auto'>
                  <table className='rounded-t-[10px] w-full text-left table-fixed min-w-[600px]'>
                    <thead className='!border-b !border-[var(--color-border)]'>
                      <tr className=''>
                        <th className='p-[10px] w-2/5'>
                          <p className='p-body1 !font-bold h-[35px] items-center flex'>Original Link(s)</p>
                        </th>

                        <th className='p-[10px] w-2/5'>
                          <p className='p-body1 !font-bold h-[35px] items-center flex'>Shorten Link(s)</p>
                        </th>
                        
                        <th className='p-[10px] w-1/5 text-right'></th>
                      </tr>
                    </thead>

                    <tbody className=''>
                      {}
                      {/* {dummyData[0].items.map((item) => ( */}
                      {urls
                      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                      .map((item) => (
                        <tr key={item.id} className='border-t border-[var(--color-border)]'>
                          <td className='p-[10px]'>
                            <p className='p-body1 text-[var(--color-text)] truncate max-w-[400px]'>
                              <a 
                                href={item.original_url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className='text-[var(--color-text-link)]'
                              >
                                  {item.original_url}
                              </a>
                            </p>
                          </td>

                          <td className='p-[10px]'>
                            <div className='flex flex-row items-center space-x-[10px]'>
                              <a 
                                // href={item.shortened_url} 
                                href={`${API_URL}/url-shortener/${item.unique_code}`}
                                target="_blank" 
                                rel="noopener noreferrer"
                                className='w-fit text-[var(--color-text-link)] p-body1 truncate'
                              >
                                {item.shortened_url}
                              </a>

                              <Button
                                type="link"
                                onClick={() => navigator.clipboard.writeText(item.shortened_url)}
                                className='!text-[var(--color-primary)] whitespace-nowrap'
                              >
                                <Copy className='inline-block w-[24px] h-[24px]'/>
                              </Button>
                            </div>
                          </td>

                          <td className='p-[10px] text-right flex justify-end'>
                            <Button
                              type="link"
                              onClick={() => clearSingle(item.id)}
                              className='!text-red-500 whitespace-nowrap'
                            >
                              Clear
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className='flex flex-row space-x-[20px] p-[20px] justify-end p-body1 text-[var(--color-text-secondary)] border-t border-[var(--color-border)] items-center min-w-[600px]'>
                      <div className='flex flex-row space-x-[10px] items-center'>
                        <p>Show:</p>

                        {/* <input type="text" /> */}
                        <select 
                          name="" 
                          id=""
                          value={pagination.limit}
                          onChange={(e) => handleLimitChange(e.target.value)}
                          className='p-body1 text-[var(--color-text-secondary)] border border-[var(--color-border)] rounded px-2 py-1'  
                        >
                          <option value="5">5</option>
                          <option value="10">10</option>
                          <option value="15">15</option>
                          <option value="20">20</option>
                        </select>
                      </div>

                      <p>{startItem}-{endItem} of {pagination.total}</p>

                      <div className='flex flex-row space-x-[10px]'>
                        <Button
                          type="link"
                          className='!w-[35px] !h-[35px] !p-0 flex items-center justify-center disabled:opacity-50'
                          onClick={goToFirstPage}
                          disabled={pagination.page === 1}
                        >
                          <ChevronFirst className='text-[var(--color-text-secondary)]'/>
                        </Button>

                        <Button
                          type="link"
                          className='!w-[35px] !h-[35px] !p-0 flex items-center justify-center disabled:opacity-50'
                          onClick={goToPreviousPage}
                          disabled={pagination.page === 1}
                        >
                          <ChevronLeft className='text-[var(--color-text-secondary)]'/>
                        </Button>

                        <Button
                          type="link"
                          className='!w-[35px] !h-[35px] !p-0 flex items-center justify-center disabled:opacity-50'
                          onClick={goToNextPage}
                          disabled={pagination.page === pagination.total_pages}
                        >
                          <ChevronRight className='text-[var(--color-text-secondary)]'/>
                        </Button>

                        <Button
                          type="link"
                          className='!w-[35px] !h-[35px] !p-0 flex items-center justify-center disabled:opacity-50'
                          onClick={goToLastPage}
                          disabled={pagination.page === pagination.total_pages}
                        >
                          <ChevronLast className='text-[var(--color-text-secondary)]'/>
                        </Button>
                      </div>
                  </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default App
