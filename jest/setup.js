/* eslint-env jest */
import serializer from 'jest-glamor-react';
import { sheet } from 'react-emotion';

expect.addSnapshotSerializer(serializer(sheet));
