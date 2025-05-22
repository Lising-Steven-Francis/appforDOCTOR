import type { Theme, SxProps } from '@mui/material/styles';
import type { OrgChartBaseNode } from 'src/components/organizational-chart';

import { _mock } from 'src/_mock';

// ----------------------------------------------------------------------

export type NodeProps = OrgChartBaseNode & {
  id?: string;
  name: string;
  group?: string;
  role?: string;
  avatarUrl?: string;
  children?: NodeProps[];
  sx?: SxProps<Theme>;
};

const rootNode = {
  group: 'root',
  role: 'ceo, co-founder',
  name: _mock.fullName(1),
  avatarUrl: _mock.image.avatar(1),
};

const group = { product: 'product design', development: 'development', marketing: 'marketing' };

// ----------------------------------------------------------------------

export const SIMPLE_DATA = {
  name: rootNode.name,
  children: [
    {
      name: _mock.fullName(2),
      role: 'Lead',
      id: _mock.id(2),
      avatarUrl: _mock.image.avatar(2),
      children: [
        {
          name: _mock.fullName(3),
          role: 'Senior',
          id: _mock.id(3),
          avatarUrl: _mock.image.avatar(3),
          children: [],
        },
      ],
    },
    {
      name: _mock.fullName(4),
      role: 'Lead',
      id: _mock.id(4),
      avatarUrl: _mock.image.avatar(4),
      children: [
        {
          name: _mock.fullName(5),
          role: 'Senior',
          id: _mock.id(5),
          avatarUrl: _mock.image.avatar(5),
          children: [
            {
              name: _mock.fullName(6),
              role: 'Back end developer',
              id: _mock.id(6),
              avatarUrl: _mock.image.avatar(6),
              children: [
                {
                  name: _mock.fullName(7),
                  role: 'Back end developer',
                  id: _mock.id(7),
                  avatarUrl: _mock.image.avatar(7),
                  children: [],
                },
              ],
            },
            {
              name: _mock.fullName(8),
              role: 'Front end',
              id: _mock.id(8),
              avatarUrl: _mock.image.avatar(8),
              children: [],
            },
          ],
        },
      ],
    },
    {
      name: _mock.fullName(9),
      role: 'Lead',
      id: _mock.id(9),
      avatarUrl: _mock.image.avatar(9),
      children: [
        {
          name: _mock.fullName(10),
          role: 'Support',
          id: _mock.id(10),
          avatarUrl: _mock.image.avatar(10),
          children: [],
        },
        {
          name: _mock.fullName(11),
          role: 'Content writer',
          id: _mock.id(11),
          avatarUrl: _mock.image.avatar(11),
          children: [],
        },
      ],
    },
  ],
};

// ----------------------------------------------------------------------

export const GROUP_DATA = {
  name: rootNode.name,
  children: [
    {
      name: group.product,
      group: group.product,
      children: [
        {
          name: _mock.fullName(2),
          group: group.product,
          role: 'Lead',
          id: _mock.id(2),
          avatarUrl: _mock.image.avatar(2),
          children: [
            {
              name: _mock.fullName(3),
              group: group.product,
              role: 'Senior',
              id: _mock.id(3),
              avatarUrl: _mock.image.avatar(3),
              children: [],
            },
          ],
        },
      ],
    },
    {
      name: group.development,
      group: group.development,
      children: [
        {
          name: _mock.fullName(4),
          group: group.development,
          role: 'Lead',
          id: _mock.id(4),
          avatarUrl: _mock.image.avatar(4),
          children: [
            {
              name: _mock.fullName(5),
              group: group.development,
              role: 'Senior',
              id: _mock.id(5),
              avatarUrl: _mock.image.avatar(5),
              children: [
                {
                  name: _mock.fullName(6),
                  group: group.development,
                  role: 'Back end developer',
                  id: _mock.id(6),
                  avatarUrl: _mock.image.avatar(6),
                  children: [
                    {
                      name: _mock.fullName(7),
                      group: group.development,
                      role: 'Back end developer',
                      id: _mock.id(7),
                      avatarUrl: _mock.image.avatar(7),
                      children: [],
                    },
                  ],
                },
                {
                  name: _mock.fullName(8),
                  group: group.development,
                  role: 'Front end',
                  id: _mock.id(8),
                  avatarUrl: _mock.image.avatar(8),
                  children: [],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: group.marketing,
      group: group.marketing,
      children: [
        {
          name: _mock.fullName(9),
          group: group.marketing,
          role: 'Lead',
          id: _mock.id(9),
          avatarUrl: _mock.image.avatar(9),
          children: [
            {
              name: _mock.fullName(10),
              group: group.marketing,
              role: 'Lead',
              id: _mock.id(10),
              avatarUrl: _mock.image.avatar(10),
              children: [],
            },
            {
              name: _mock.fullName(11),
              group: group.marketing,
              role: 'Content writer',
              id: _mock.id(11),
              avatarUrl: _mock.image.avatar(11),
              children: [],
            },
          ],
        },
      ],
    },
  ],
};
