'use client';

import React, { useState } from 'react';
import type { DrawerProps, RadioChangeEvent } from 'antd';
import { ConfigProvider, Drawer } from 'antd';
import { IoMenu } from 'react-icons/io5';
import Link from 'next/link';

type Props = {
  active?: 'home' | 'trending' | 'popular';
};

const Sidebar: React.FC = ({ active = 'home' }: Readonly<Props>) => {
  const [open, setOpen] = useState(false);
  const [placement, setPlacement] = useState<DrawerProps['placement']>('left');

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const onChange = (e: RadioChangeEvent) => {
    setPlacement(e.target.value);
  };

  return (
    <>
      <button className="btn btn-ghost" onClick={showDrawer}>
        <IoMenu className="h-10 w-10" />
      </button>
      <ConfigProvider
        theme={{
          token: {
            colorBgElevated: '#000000',
          },
        }}
      >
        <Drawer
          title={
            <Link href={'/'} className="text-4xl text-white font-bold">
              Ninja<span className="text-blue-400">Kamui</span>
            </Link>
          }
          placement={placement}
          closable={false}
          onClose={onClose}
          open={open}
          key={placement}
        >
          <div className="flex flex-col gap-5 text-2xl font-semibold">
            <Link
              href={'/'}
              className={`text-white h-10 flex items-center ${
                active === 'home'
                  ? 'bg-gray-400/30 rounded-md'
                  : 'hover:bg-gray-400/30 rounded-md'
              }`}
            >
              <span className="ml-1">Home</span>
            </Link>
            <Link
              href={'/trending'}
              className={`text-white h-10 flex items-center ${
                active === 'trending'
                  ? 'bg-gray-400/30 rounded-md'
                  : 'hover:bg-gray-400/30 rounded-md'
              }`}
            >
              <span className="ml-1">Trending</span>
            </Link>
            <Link
              href={'/popular'}
              className={`text-white h-10 flex items-center ${
                active === 'popular'
                  ? 'bg-gray-400/30 rounded-md'
                  : 'hover:bg-gray-400/30 rounded-md'
              }`}
            >
              <span className="ml-1">Popular</span>
            </Link>
          </div>
        </Drawer>
      </ConfigProvider>
    </>
  );
};

export default Sidebar;
