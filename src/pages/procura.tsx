import { Fragment, useContext, useEffect, useState } from 'react'
import Head from 'next/head'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { BellIcon, MenuIcon, XIcon } from '@heroicons/react/outline'
import { AuthContext } from '../contexts/AuthContext'
import { api } from '../services/api'
import { destroyCookie, parseCookies } from 'nookies'
import { GetServerSideProps } from 'next'
import { getAPIClient } from '../services/axios'
import { useRouter } from 'next/router'; // Importe useRouter corretamente



const navigation = ['Home', 'Procura']
const profile = ['Seu perfil', 'Configuração']


function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const router = useRouter();   
    // This will give you the current page path

  const handleLogout = () => {
    // Remova o token de autenticação dos cookies
    console.log("useRouter")
    destroyCookie(null, 'kafra.token');
    // Redirecione o usuário de volta para a página inicial
    router.push('/');
  };

  const data = [
    { title: "Item econtrado: variavel ", description: "dados a mais", year: "21/05/2007 14:44" },
    { title: "Item econtrado: variavel ", description: "dados a mais", year: "21/05/2007 14:00" },
    { title: "Item econtrado: variavel ", description: "dados a mais", year: "21/05/2007 13:35" },
    { title: "Item econtrado: variavel ", description: "dados a mais", year: "21/05/2007 12:00" },
    { title: "Item econtrado: variavel ", description: "dados a mais", year: "21/05/2007 10:44" },
    { title: "Item econtrado: variavel ", description: "dados a mais", year: "21/05/2007 08:00" },
    { title: "Item econtrado: variavel ", description: "dados a mais", year: "21/05/2007 01:44" },
    { title: "Item econtrado: variavel ", description: "dados a mais", year: "21/05/2007 00:30" },
    { title: "Item econtrado: variavel ", description: "dados a mais", year: "20/05/2007 14:44" },
    // Outros objetos JSON aqui
  ];
  
  return (
    <div>
      <Head>
        <title>Home</title>
      </Head>

      <Disclosure as="nav" className="bg-gray-800">
        {({ open }) => (
          <>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <img
                      className="h-8 w-8"
                      src="https://tailwindui.com/img/logos/workflow-mark-indigo-500.svg"
                      alt="Workflow"
                    />
                  </div>
                  <div className="hidden md:block">
                    <div className="ml-10 flex items-baseline space-x-4">
                      {navigation.map((item, itemIdx) =>
                        itemIdx === 0 ? (
                          <Fragment key={item}>
                            {/* Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" */}
                            <a href="/dashboard" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                              {item}
                            </a>
                          </Fragment>
                        ) : (
                          <a
                            key={item}
                            href="/procura"
                            className="bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium"
                          >
                            {item}
                          </a>
                        )
                      )}
                    </div>
                  </div>
                </div>
                <div className="hidden md:block">
                  <div className="ml-4 flex items-center md:ml-6">
                    <button className="bg-gray-800 p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                      <span className="sr-only">Notificação</span>
                      <BellIcon className="h-6 w-6" aria-hidden="true" />
                    </button>

                    {/* Profile dropdown */}
                    <Menu as="div" className="ml-3 relative">
                      {({ open }) => (
                        <>
                          <div>
                            <Menu.Button className="max-w-xs bg-gray-800 rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                              <span className="sr-only">Menu</span>
                              <img
                                className="h-8 w-8 rounded-full"
                                src={user?.avatar_url}
                                alt=""
                              />
                            </Menu.Button>
                          </div>
                          <Transition
                            show={open}
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                          >
                            <Menu.Items
                              static
                              className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                            >
                              {profile.map((item) => (
                                <Menu.Item key={item}>
                                  {({ active }) => (
                                    <a
                                      href="#"
                                      className={classNames(
                                        active ? 'bg-gray-100' : '',
                                        'block px-4 py-2 text-sm text-gray-700'
                                      )}
                                    >
                                      {item}
                                    </a>
                                  )}
                                </Menu.Item>
                              ))}
                              <Menu.Item>
                                <a
                                  onClick={handleLogout} 
                                  href="#"
                                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700"
                                >
                                  Sair
                                </a>
                              </Menu.Item>
                            </Menu.Items>
                          </Transition>
                        </>
                      )}
                    </Menu>
                  </div>
                </div>
                <div className="-mr-2 flex md:hidden">
                  {/* Mobile menu button */}
                  <Disclosure.Button className="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
              </div>
            </div>

            <Disclosure.Panel className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                {navigation.map((item, itemIdx) =>
                  itemIdx === 0 ? (
                    <Fragment key={item}>
                      {/* text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium*/}
                      <a href="/dashboard" className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
                        {item}
                      </a>
                    </Fragment>
                  ) : (
                    <a
                      key={item}
                      href="/procura"
                      className="bg-gray-900 text-white block px-3 py-2 rounded-md text-base font-medium"
                    >
                      {item}
                    </a>
                  )
                )}
              </div>
              <div className="pt-4 pb-3 border-t border-gray-700">
                <div className="flex items-center px-5">
                  <div className="flex-shrink-0">
                    <img
                      className="h-10 w-10 rounded-full"
                      src={user?.avatar_url}
                      alt=""
                    />
                  </div>
                  <div className="ml-3">
                  <div className="text-base font-medium leading-none text-white">
                    <a href="#">{user?.name}</a>
                  </div>
                    <div className="text-sm font-medium leading-none text-gray-400">
                    <a href="#">{user?.email}</a>
                  </div>
                  </div>
                  <button className="ml-auto bg-gray-800 flex-shrink-0 p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                    <span className="sr-only">notificação</span>
                    <BellIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <div className="mt-3 px-2 space-y-1">
                  {profile.map((item) => (
                    <a
                      key={item}
                      href="#"
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700"
                    >
                      {item}
                    </a>
                  ))}
                  <a
                    onClick={handleLogout} 
                    href="#"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700"
                  >
                    Sair
                  </a>
                </div>
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>

      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Cadastre sua procura</h1>
        </div>
      </header>
      <main>
      <div className="py-1">
        {/* começo meio da tela */}
        {/* cadastro começo */}
        <div className="relative flex justify-center py-10">
            <form className="bg-white">
                <p className="text-sm font-normal text-gray-600 mb-1">Assim que você se cadastrar em nosso sistema, ele começará a buscar por você. Quando encontrar algo relevante, você receberá um alerta na página inicial.</p>
                <p className="text-sm font-normal text-gray-600 mb-3">Obs: O item procurado é o mesmo que é fornecido ao realizar uma consulta no site do Kafraverse.</p>
                <div className="flex items-center border-2 py-2 px-3 rounded-2xl mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                    <input className="pl-2 outline-none border-none" type="text" name="" id="" placeholder="Nome do item Procurado" />
                </div>
                    <div className="flex items-center border-2 py-2 px-3 rounded-2xl mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                        </svg>
                        <input className="pl-2 outline-none border-none" type="text" name="" id="" placeholder="Valor Máximo" /> 
                    </div>
                    <select className="flex w-full items-center border-2 py-2 px-3 rounded-2xl mb-4">
                            <option className="pl-2 outline-none border-none" value="zeny">Zeny</option>
                            <option className="pl-2 outline-none border-none" value="cash">Cash</option>
                    </select>
                    <button type="submit" className="block w-full bg-indigo-600 mt-4 py-2 rounded-2xl text-white font-semibold mb-2">Adicionar</button>
            </form>
        </div>
         {/* cadastro fim */}
         {/* list inicio */}
         <div className="max-w-lg mx-auto my-10 bg-white p-8 rounded-xl shadow shadow-slate-300">
            <div className="flex flex-row justify-between items-center">
                <div>
                    <h1 className="text-3xl font-medium">Lista de itens cadastrados</h1>
                </div>
            </div>
            <div id="tasks" className="my-5">
                <div id="task" className="flex justify-between items-center border-b border-slate-200 py-3 px-2 border-l-4  border-l-transparent">
                    <div className="inline-flex items-center space-x-2">
                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6 text-slate-500">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>                          
                        </div>
                        <div className="text-slate-500">drops zeny5000</div>
                    </div>
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-4 h-4 text-slate-500 hover:text-slate-700 hover:cursor-pointer">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>                      
                    </div>
                </div>
            </div>
            <p className="text-xs text-slate-500 text-center">Os itens dessa lista seram procurados no site</p>
        </div>
        {/* list fim */}
        {/* fim meio da tela */}
      </div>
      </main>
    </div>
  )
}

 export const getServerSideProps: GetServerSideProps = async (ctx) => {
   try {
   const apiClient = getAPIClient(ctx);
   const { ['kafra.token']: token } = parseCookies(ctx)
   if (!token) {
     return {
       redirect: {
         destination: '/',
         permanent: false,
       }
     }
   }
    const resultado =  await apiClient.get('/validaToken')
    //console.log(resultado.data.resultado);
   return {
     props: {}
   }

   } catch (error) {
     if (error.response && error.response.status === 400) {
       return {
         redirect: {
           destination: '/',
           permanent: false,
         }
       };
     } else {
       // Handle other errors here if needed
       throw error; // Re-throw the error to be caught by Next.js error handling
     }
   }
 }