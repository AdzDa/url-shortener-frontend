import { useState } from 'react'
import './App.css'
import Header from './components/Header'
import Footer from './components/Footer'
import Button from './components/Button'
import Tag from './components/Tag'
import BentoTab from './components/BentoTab'
import { dummyData } from './data/dummy/dummy-data'
import { Copy, ChevronLast, ChevronFirst, ChevronLeft, ChevronRight } from 'lucide-react';

function App() {
  return (
    <div className='w-full min-h-screen flex flex-col'>
      <Header />

      <main className='flex-1 flex flex-col px-[120px] py-[50px] space-y-[50px]'>
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
                      <div className='p-[20px] flex flex-col space-y-[10px]'>
                        <p className='p-body1 text-[var(--color-primary)] text-left'>Paste your link here:</p>

                        <div className='flex flex-row space-x-[10px]'>
                          <input
                            type="text"
                            placeholder='URL (eg:www.example.com)'
                            className='flex-1 p-[10px] rounded-[5px] border border-[var(--color-border)]'
                          />

                          <Button
                            type="primary"
                            onClick={() => {}}
                          >
                            Shorten URL
                          </Button>
                        </div>
                      </div>
                    )
                  },
                  {
                    label: 'Multiple URL',
                    content: (
                      <div className='p-[20px]'>
                        Multiple URL Content
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
              onClick={() => {}}
              className='!text-red-500 whitespace-nowrap'
            >
              <p className='!w-full'>Clear all</p>
            </Button>
          </div>

          <div className='rounded-[10px] bg-[var(--color-primary)] p-[10px]'>
            <div className='w-full rounded-[10px] bg-white min-h-[200px]'>
                <table className='rounded-t-[10px] w-full text-left table-fixed'>
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

                  <tbody>
                    {dummyData[0].items.map((item) => (
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
                              href={item.shortened_url} 
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
                            onClick={() => {}}
                            className='!text-red-500 whitespace-nowrap'
                          >
                            Clear
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className='flex flex-row space-x-[20px] p-[20px] justify-end p-body1 text-[var(--color-text-secondary)] border-t border-[var(--color-border)] items-center'>
                    <div className='flex flex-row space-x-[10px] items-center'>
                      <p>Show:</p>

                      {/* <input type="text" /> */}
                      <select 
                        name="" 
                        id="">
                        <option value="10">5</option>
                        <option value="25">10</option>
                        <option value="50">15</option>
                        <option value="100">20</option>
                      </select>
                    </div>

                    <p>1-10 of 200</p>

                    <div className='flex flex-row space-x-[10px]'>
                      <Button
                        type="link"
                        className='!w-[35px] !h-[35px] !p-0 flex items-center justify-center'
                        onClick={() => {}}
                      >
                        <ChevronFirst className='text-[var(--color-text-secondary)]'/>
                      </Button>

                      <Button
                        type="link"
                        className='!w-[35px] !h-[35px] !p-0 flex items-center justify-center'
                        onClick={() => {}}
                      >
                        <ChevronLeft className='text-[var(--color-text-secondary)]'/>
                      </Button>

                      <Button
                        type="link"
                        className='!w-[35px] !h-[35px] !p-0 flex items-center justify-center'
                        onClick={() => {}}
                      >
                        <ChevronRight className='text-[var(--color-text-secondary)]'/>
                      </Button>

                      <Button
                        type="link"
                        className='!w-[35px] !h-[35px] !p-0 flex items-center justify-center'
                        onClick={() => {}}
                      >
                        <ChevronLast className='text-[var(--color-text-secondary)]'/>
                      </Button>
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
