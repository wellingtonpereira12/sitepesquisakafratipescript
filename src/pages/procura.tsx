import { Fragment, useContext, useEffect, useState } from 'react'
import Head from 'next/head'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { BellIcon, MenuIcon, XIcon } from '@heroicons/react/outline'
import { AuthContext } from '../contexts/AuthContext'
import { destroyCookie, parseCookies } from 'nookies'
import { GetServerSideProps } from 'next'
import { getAPIClient } from '../services/axios'
import { useRouter } from 'next/router'; // Importe useRouter corretamente

const navigation = ['Home', 'Procura'];
const profile = ['Seu perfil', 'Configuração'];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const router = useRouter();

  const handleLogout = () => {
    destroyCookie(null, 'kafra.token');
    router.push('/');
  };

  const carregaML = async (pacote) => {
    try {
      console.log(pacote);
      const { ['kafra.token']: token } = parseCookies();
      const response = await fetch(`http://localhost:3002/mercadoPagoCriaPagamento?text=${encodeURIComponent(pacote)}`, {
        method: 'post',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const link = await response.json();
      window.open(`${link.resultado}`);      
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDelete = async (text) => {
    try {
      console.log(text);
      const { ['kafra.token']: token } = parseCookies();
      await fetch(`http://localhost:3002/deleteProcura?text=${encodeURIComponent(text)}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setTasks(tasks.filter(task => task.text !== text));
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const [tasks, setTasks] = useState([]); 
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user && user.objProcura) {
          const newTasks = [];
          for (let i = 0; i < user.objProcura.length; i++) {
            const item = await user.objProcura[i];
            newTasks.push({ text: `Item procurado: ${item.nome} | ${item.moeda}: ${item.valor}` });
          }
          setTasks(prevTasks => [...prevTasks, ...newTasks]);
        } else {
          console.error('User or user.objProcura is null.');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };
    fetchData();
  }, [user]);
  

  // Add handleAdd function for form submission
  const handleAdd = async (event) => {
    event.preventDefault();
    const itemName = event.target.itemName.value;
    const maxValue = event.target.maxValue.value;
    const currency = event.target.currency.value;

    const data = { itemName, maxValue, currency };

    console.log(data)

    try {
        const { ['kafra.token']: token } = parseCookies();
        const response = await fetch('http://localhost:3002/gravaProcura', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const responseData = await response.json();
        router.reload()
    } catch (error) {
        console.error('Error:', error);
    }

};

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
        {/* começo meio da tela */}
        {/* cadastro começo */}
      <main>
      <div className="py-1">
        <div className="relative flex justify-center py-10">
            <form className="bg-white" onSubmit={handleAdd}>
                <p className="text-sm font-normal text-gray-600 mb-1">Assim que você se cadastrar em nosso sistema, ele começará a buscar por você. Quando encontrar algo relevante, você receberá um alerta na página inicial.</p>
                <p className="text-sm font-normal text-gray-600 mb-3">Obs: O item procurado é o mesmo que é fornecido ao realizar uma consulta no site do Kafraverse.</p>
                <div className="flex items-center border-2 py-2 px-3 rounded-2xl mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                    <input className="pl-2 outline-none border-none" type="text" name="itemName" placeholder="Nome do item Procurado" />
                </div>
                    <div className="flex items-center border-2 py-2 px-3 rounded-2xl mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                        </svg>
                        <input className="pl-2 outline-none border-none" type="text" name="maxValue" placeholder="Valor Máximo" /> 
                    </div>
                    <select name="currency" className="flex w-full items-center border-2 py-2 px-3 rounded-2xl mb-4">
                        <option className="pl-2 outline-none border-none" value="zeny">Zeny</option>
                        <option className="pl-2 outline-none border-none" value="cash">Cash</option>
                    </select>
                    <button type="submit" className="block w-full bg-indigo-600 mt-4 py-2 rounded-2xl text-white font-semibold mb-2" >Adicionar</button>
            </form>
        </div>
         {/* cadastro fim */}
         {/* list inicio */}
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-80">
          <div className="px-4 py-6 sm:px-0">
            <div className="border-4 border-dashed border-gray-200 rounded-lg h-auto">
              <h1 className="text-3xl font-bold leading-tight text-gray-900 mb-4">Lista Procurada: {`${user?.objPacote[0].totalusado || '0'}/${user?.objPacote[0].qtdproc || '0'} usados`}</h1>
              <ul className="space-y-4">
              {Array.isArray(tasks) && tasks.map((task) => (
                  task && (
                      <li key={task.id} className="flex items-center justify-between p-4 bg-white shadow rounded-lg">
                          <span>{task.text}</span>
                          <button onClick={() => handleDelete(task.text)}>Delete</button>
                      </li>
                  )
              ))}
            </ul>
            </div>
          </div>
        </div>
      </div>
      </main>
        {/* list fim */}
        {/* fim meio da tela */}
      <div className="flex items-end justify-end fixed bottom-0 right-0 mb-4 mr-4 z-10">
        <div>
          <a
            title="Suporte"
            href="https://api.whatsapp.com/send/?phone=47984862476&text&type=phone_number&app_absent=0"
            target="_blank"
            className="block w-16 h-16 rounded-full transition-all shadow hover:shadow-lg transform hover:scale-110 hover:rotate-12"
          >
            <img
              className="object-cover object-center w-full h-full rounded-full"
              src="https://static-media.hotmart.com/stZM0s_uceiciEtzRj-M36041sY=/300x300/smart/filters:format(webp):background_color(white)/hotmart/product_pictures/93717141-7ca0-49d0-9a85-8a271c76157d/whatsappsuporte.png?w=920"
            />
          </a>
        </div>
      </div>
      {user?.objPacote[0].vencimento == '' ? (          
      <div className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-base font-semibold leading-7 text-teal-600">Preços</h2>
            <p className="mt-2 text-4xl font-bold tracking-tight text-blue-500 sm:text-5xl">Libere mais slots para colocar procuras</p>
          </div>
          <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-cyan-600">Escolhe entre nossos três pacotes</p>
          <div className="isolate mx-auto mt-10 grid max-w-md grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            <div className="rounded-3xl p-8 ring-1 xl:p-10 bg-gray-90 ring-gray-900">
              <h3 id="tier-freelancer" className="text-lg font-semibold leading-8 text-orange-600">Standar</h3>
              <p className="mt-4 text-sm leading-6 text-black-600">Plano com acessos a todas as nossas fictures por 1 mês.</p>
              <p className="mt-6 flex items-baseline gap-x-1">
                <span className="text-4xl font-bold tracking-tight text-pink-900">R$ 5,00</span>
                <span className="text-sm font-semibold leading-6 text-teal-600">/1 mês</span>
              </p>
              <a onClick={() => carregaML(0)} href="#" aria-describedby="tier-startup" className="mt-6 block rounded-md py-2 px-3 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 bg-green-600 text-white shadow-sm hover:bg-green-800 focus-visible:outline-red-600">Compre Com Mercado Pago</a>
              <ul role="list" className="mt-8 space-y-3 text-sm leading-6 xl:mt-10 text-black-400">
                <li className="flex gap-x-3">
                  <svg className="h-6 w-5 flex-none text-green-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
                  </svg>
                  +5 slots de procura
                </li>
                <li className="flex gap-x-3">
                  <svg className="h-6 w-5 flex-none text-green-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
                  </svg>
                  Verifica as cinco primeira páginas
                </li>
                <li className="flex gap-x-3">
                  <svg className="h-6 w-5 flex-none text-green-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
                  </svg>
                  Notificação no navegador e alarme 
                </li>
                <li className="flex gap-x-3">
                  <svg className="h-6 w-5 flex-none text-green-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
                  </svg>
                  Tenha prioridade nas procuras acima do plano free
                </li>
              </ul>
            </div>
            <div className="rounded-3xl p-8 ring-1 xl:p-10 bg-gray-200 ring-gray-900">
              <h3 id="tier-startup" className="text-lg font-semibold leading-8 text-gray-900">Prime</h3>
              <p className="mt-4 text-sm leading-6 text-cyan-600">Plano com mais slots com acesso a todas as nossas fictures por 1 mês.</p>
              <p className="mt-6 flex items-baseline gap-x-1">
                <span className="text-4xl font-bold tracking-tight text-pink-900">R$ 15,00</span>
                <span className="text-sm font-semibold leading-6 text-teal-600">/1 mês</span>
              </p>
              <a onClick={() => carregaML(1)} href="#" aria-describedby="tier-startup" className="mt-6 block rounded-md py-2 px-3 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 bg-green-600 text-white shadow-sm hover:bg-green-800 focus-visible:outline-red-600">Compre Com Mercado Pago</a>
              <ul role="list" className="mt-8 space-y-3 text-sm leading-6 xl:mt-10 text-black-600">
                <li className="flex gap-x-3">
                  <svg className="h-6 w-5 flex-none text-green-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
                  </svg>
                  +25 slots por 1 mês
                </li>
                <li className="flex gap-x-3">
                  <svg className="h-6 w-5 flex-none text-green-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
                  </svg>
                  Verifica as dez primeiras páginas
                </li>
                <li className="flex gap-x-3">
                  <svg className="h-6 w-5 flex-none text-green-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
                  </svg>
                  Notificação no navegador e alarme
                </li>
                <li className="flex gap-x-3">
                  <svg className="h-6 w-5 flex-none text-green-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
                  </svg>
                  Tenha prioridade nas procuras acima do plano Standar e Free
                </li>
              </ul>
            </div>
            <div className="rounded-3xl p-8 ring-1 xl:p-10 bg-gray-800 ring-gray-900">
              <h3 id="tier-enterprise" className="text-lg font-semibold leading-8 text-white">Premium</h3>
              <p className="mt-4 text-sm leading-6 text-gray-300">Plano com mais slots com acesso a todas as nossas fictures por 1 mês.</p>
              <p className="mt-6 flex items-baseline gap-x-1">
                <span className="text-4xl font-bold tracking-tight text-white">R$ 30,00</span>
                <span className="text-sm font-semibold leading-6 text-white">/1 mês</span>
              </p>
              <a onClick={() => carregaML(2)} href="#" aria-describedby="tier-startup" className="mt-6 block rounded-md py-2 px-3 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 bg-green-600 text-white shadow-sm hover:bg-green-800 focus-visible:outline-red-600">
                Compre Com Mercado Pago
              </a>
              <ul role="list" className="mt-8 space-y-3 text-sm leading-6 xl:mt-10 text-gray-300">
                <li className="flex gap-x-3">
                  <svg className="h-6 w-5 flex-none text-white" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
                  </svg>
                  Slots ilimitado por 1 mês
                </li>
                <li className="flex gap-x-3">
                  <svg className="h-6 w-5 flex-none text-white" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
                  </svg>
                  Verifica todas as páginas
                </li>
                <li className="flex gap-x-3">
                  <svg className="h-6 w-5 flex-none text-white" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
                  </svg>
                  Notificação no navegador e alarme
                </li>
                <li className="flex gap-x-3">
                  <svg className="h-6 w-5 flex-none text-white" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
                  </svg>
                  Tenha prioridade nas procuras acima de todos os outros pacotes
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      ) : (
        // Renderização para o caso em que o valor é falso
        <div className="bg-white py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-4xl text-center">
              <h2 className="text-base font-semibold leading-7 text-teal-600">Obrigado!</h2>
              <p className="mt-2 text-4xl font-bold tracking-tight text-blue-500 sm:text-5xl">{`Você é ${user?.objPacote[0].pacotes || ''} até ${user?.objPacote[0].vencimento || ''}` }</p>
            </div>
          </div>
        </div>
      )}
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