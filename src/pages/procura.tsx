import { Fragment, useContext, useEffect } from 'react'
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
    // useEffect(() => {
    //   api.get('/validaToken');
    // }, [])
    let clickMenu;

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
                            <a href="/dashboard" className="bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium">
                              {item}
                            </a>
                          </Fragment>
                        ) : (
                          <a
                            key={item}
                            href="/procura"
                            className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
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
                      {/* Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" */}
                      <a href="/dashboard" className="bg-gray-900 text-white block px-3 py-2 rounded-md text-base font-medium">
                        {item}
                      </a>
                    </Fragment>
                  ) : (
                    <a
                      key={item}
                      href="/procura"
                      className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
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
          <h1 className="text-3xl font-bold text-gray-900">Home</h1>
        </div>
      </header>
      <main>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* começo notificação */}
        <div className="relative overflow-hidden flex md:w-1/2 justify-center py-10 items-center bg-white mx-7">
            <form className="bg-white">
                <h1 className="text-gray-800 font-bold text-2xl mb-1">Cadastre sua procura</h1>
                <p className="text-sm font-normal text-gray-600 mb-7">Assim que você se cadastrar em nosso sistema, ele começará a buscar por você. Quando encontrar algo relevante, você receberá um alerta na página inicial.</p>
                <div className="flex items-center border-2 py-2 px-3 rounded-2xl mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                    <input className="pl-2 outline-none border-none" type="text" name="" id="" placeholder="Item Procurado" />
                </div>
                    <div className="flex items-center border-2 py-2 px-3 rounded-2xl mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                        </svg>
                        <input className="pl-2 outline-none border-none" type="text" name="" id="" placeholder="Valor Máximo" />
                    </div>
                    <button type="submit" className="block w-full bg-indigo-600 mt-4 py-2 rounded-2xl text-white font-semibold mb-2">Adicionar</button>
            </form>
        </div>
        <div className="h-screen md:flex">
        <div className="">
            <div>
                {/* grid */} 
            </div>
        </div>
        </div>
        {/* fim notificação */}
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