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

  const [tasks, setTasks] = useState([]); 
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user && user.objAlerta) {
          setTasks(user.objAlerta);
        } else {
          console.error('User or user.objAlerta is null.');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };
    fetchData();
  }, [user]);
  
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
          <div className="flex items-top justify-center bg-white px-6 md:px-60 h-screen">
            <div className="space-y-6 border-l-2 border-dashed">
            {Array.isArray(tasks) && tasks.map((task) => (
              task && (
                <div key={task.id} className="relative w-full">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="absolute -top-0.5 z-10 -ml-3.5 h-7 w-7 rounded-full text-blue-500">
                    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                  </svg>
                  <div className="ml-6">
                    <h4 className="font-bold text-blue-500">{task.titulo}</h4>
                    <p className="mt-2 max-w-screen-sm text-sm text-gray-500">{task.descricao}</p>
                    <span className="mt-1 block text-sm font-semibold text-blue-500">{task.data}</span>
                  </div>
                </div>
              )  
            ))}
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