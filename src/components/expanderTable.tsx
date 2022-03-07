import * as React from 'react';
//import ReactDOM from 'react-dom';
import { Table, Toggle, TagPicker } from 'rsuite';

const { HeaderCell, Cell, Column, ColumnGroup } = Table;

export interface State {
  tableData: { columns: any[]; data: any[] };
}

let data = [
  {
    id: 1,
    avartar: 'https://via.placeholder.com/40x40/3498ff/FFFFFF?text=E',
    city: 'New Amieshire',
    email: 'Leora13@yahoo.com',
    firstName: 'Ernest Schuppe SchuppeSchuppeSchuppeSchuppeSchuppeSchuppe Schuppe',
    lastName: 'Schuppe',
    street: 'Ratke Port',
    zipCode: '17026-3154',
    date: '2016-09-23T07:57:40.195Z',
    bs: 'global drive functionalities',
    catchPhrase: 'Intuitive impactful software',
    companyName: 'Lebsack - Nicolas',
    words: 'saepe et omnis',
    sentence: 'Quos aut sunt id nihil qui.',
    stars: 820,
    followers: 70,
  },
  {
    id: 2,
    avartar: 'https://via.placeholder.com/40x40/3498ff/FFFFFF?text=J',
    city: 'New Gust',
    email: 'Mose_Gerhold51@yahoo.com',
    firstName: 'Janis',
    lastName: 'Vandervort',
    street: 'Dickinson Keys',
    zipCode: '43767',
    date: '2017-03-06T09:59:12.551Z',
    bs: 'e-business maximize bandwidth',
    catchPhrase: 'De-engineered discrete secured line',
    companyName: 'Glover - Hermiston',
    words: 'deleniti dolor nihil',
    sentence: 'Illo quidem libero corporis laborum.',
    stars: 1200,
    followers: 170,
  },
  {
    id: 3,
    avartar: 'https://via.placeholder.com/40x40/3498ff/FFFFFF?text=M',
    city: 'Lefflerstad',
    email: 'Frieda.Sauer61@gmail.com',
    firstName: 'Makenzie',
    lastName: 'Bode',
    street: 'Legros Divide',
    zipCode: '54812',
    date: '2016-12-08T13:44:26.557Z',
    bs: 'plug-and-play e-enable content',
    catchPhrase: 'Ergonomic 6th generation challenge',
    companyName: 'Williamson - Kassulke',
    words: 'quidem earum magnam',
    sentence: 'Nam qui perferendis ut rem vitae saepe.',
    stars: 610,
    followers: 170,
  },
  {
    id: 4,
    avartar: 'https://via.placeholder.com/40x40/3498ff/FFFFFF?text=C',
    city: 'East Catalina',
    email: 'Eloisa.OHara@hotmail.com',
    firstName: 'Ciara',
    lastName: 'Towne',
    street: 'Schimmel Ramp',
    zipCode: '76315-2246',
    date: '2016-07-19T12:54:30.994Z',
    bs: 'extensible innovate e-business',
    catchPhrase: 'Upgradable local model',
    companyName: 'Hilpert, Eichmann and Brown',
    words: 'exercitationem rerum sit',
    sentence: 'Qui rerum ipsa atque qui.',
    stars: 5322,
    followers: 170,
  },
  {
    id: 5,
    avartar: 'https://via.placeholder.com/40x40/3498ff/FFFFFF?text=S',
    city: 'Ritchieborough',
    email: 'Brisa46@hotmail.com',
    firstName: 'Suzanne',
    lastName: 'Wolff',
    street: 'Lemuel Radial',
    zipCode: '88870-3897',
    date: '2017-02-23T17:11:53.875Z',
    bs: 'back-end orchestrate networks',
    catchPhrase: 'Exclusive human-resource knowledge base',
    companyName: 'Mayer - Considine',
    words: 'voluptatum tempore at',
    sentence: 'Enim quia deleniti molestiae aut.',
    stars: 852,
    followers: 770,
  },
  {
    id: 6,
    avartar: 'https://via.placeholder.com/40x40/3498ff/FFFFFF?text=A',
    city: 'Lake Emery',
    email: 'Cody.Schultz56@gmail.com',
    firstName: 'Alessandra',
    lastName: 'Feeney',
    street: 'Mosciski Estate',
    zipCode: '81514',
    date: '2016-06-30T05:23:18.734Z',
    bs: 'sexy evolve technologies',
    catchPhrase: 'Virtual hybrid throughput',
    companyName: 'Nikolaus and Sons',
    words: 'alias minus repudiandae',
    sentence: 'Sed qui eius excepturi sunt voluptates.',
    stars: 3209,
    followers: 2780,
  },
  {
    id: 7,
    avartar: 'https://via.placeholder.com/40x40/3498ff/FFFFFF?text=M',
    city: 'East Dejuan',
    email: 'Enrico_Beer@yahoo.com',
    firstName: 'Margret',
    lastName: 'Heller',
    street: 'Gunner Drive',
    zipCode: '17423-9317',
    date: '2017-03-13T21:09:47.253Z',
    bs: 'wireless morph synergies',
    catchPhrase: 'Profit-focused radical help-desk',
    companyName: 'Corwin, Maggio and Wintheiser',
    words: 'temporibus possimus neque',
    sentence: 'Eum amet ea non natus qui assumenda illo officia qui.',
    stars: 9920,
    followers: 570,
  },
  {
    id: 8,
    avartar: 'https://via.placeholder.com/40x40/3498ff/FFFFFF?text=E',
    city: 'Schummtown',
    email: 'Mitchel.Herman@yahoo.com',
    firstName: 'Emiliano',
    lastName: 'Moore',
    street: 'Maria Junctions',
    zipCode: '33930-7081',
    date: '2016-03-27T07:26:57.345Z',
    bs: 'customized integrate e-tailers',
    catchPhrase: 'Total system-worthy contingency',
    companyName: 'Gulgowski - Botsford',
    words: 'deleniti ipsa hic',
    sentence: 'Ducimus id quaerat neque.',
    stars: 3820,
    followers: 880,
  },
  {
    id: 9,
    avartar: 'https://via.placeholder.com/40x40/3498ff/FFFFFF?text=A',
    city: 'Gilberthaven',
    email: 'Gaylord_Reichel16@yahoo.com',
    firstName: 'Alessandra',
    lastName: 'Smith',
    street: 'Kali Spurs',
    zipCode: '01370',
    date: '2017-01-24T22:11:53.835Z',
    bs: 'extensible repurpose action-items',
    catchPhrase: 'Virtual dedicated definition',
    companyName: 'Maggio LLC',
    words: 'libero unde est',
    sentence: 'Non adipisci hic laboriosam et qui laudantium aspernatur.',
    stars: 330,
    followers: 590,
  },
  {
    id: 10,
    avartar: 'https://via.placeholder.com/40x40/3498ff/FFFFFF?text=E',
    city: 'Felicitychester',
    email: 'Eileen48@gmail.com',
    firstName: 'Eldridge',
    lastName: 'Bins',
    street: 'Casper Squares',
    zipCode: '80025-1552',
    date: '2016-07-20T05:59:45.630Z',
    bs: 'cutting-edge expedite partnerships',
    catchPhrase: 'Organic user-facing functionalities',
    companyName: 'Leffler, Cummerata and Price',
    words: 'sed exercitationem quas',
    sentence: 'Voluptas dolorem quasi aspernatur.',
    stars: 923,
    followers: 704,
  },
  {
    id: 11,
    avartar: 'https://via.placeholder.com/40x40/3498ff/FFFFFF?text=C',
    city: 'Caleighhaven',
    email: 'Rico_Nolan@hotmail.com',
    firstName: 'Claude',
    lastName: 'Hermiston',
    street: 'Bode Pine',
    zipCode: '76773',
    date: '2017-03-13T08:02:41.211Z',
    bs: 'back-end innovate infomediaries',
    catchPhrase: 'Stand-alone global customer loyalty',
    companyName: 'Heller, Rosenbaum and Lockman',
    words: 'ut quia ut',
    sentence: 'Eos consequatur magni incidunt.',
    stars: 421,
    followers: 403,
  },
  {
    id: 12,
    avartar: 'https://via.placeholder.com/40x40/3498ff/FFFFFF?text=C',
    city: 'Herzogmouth',
    email: 'Dawn_Metz@yahoo.com',
    firstName: 'Clarabelle',
    lastName: 'Ankunding',
    street: 'Nolan Summit',
    zipCode: '04355',
    date: '2016-07-09T09:07:34.744Z',
    bs: 'granular deliver relationships',
    catchPhrase: 'Multi-lateral zero defect analyzer',
    companyName: 'Mante, Oberbrunner and Collins',
    words: 'eos fuga repellat',
    sentence: 'Cum corporis molestias quia.',
    stars: 8203,
    followers: 704,
  },
  {
    id: 13,
    avartar: 'https://via.placeholder.com/40x40/3498ff/FFFFFF?text=H',
    city: 'Eulaliabury',
    email: 'Ron.Franecki@gmail.com',
    firstName: 'Hubert',
    lastName: 'Boehm',
    street: 'Anastacio Springs',
    zipCode: '91444',
    date: '2016-04-22T16:37:24.331Z',
    bs: 'one-to-one transition methodologies',
    catchPhrase: 'Switchable asymmetric function',
    companyName: 'Greenholt, Homenick and Considine',
    words: 'sed incidunt quo',
    sentence: 'Sed adipisci aliquam ut eius ut ipsa consequatur.',
    stars: 8209,
    followers: 909,
  },
  {
    id: 14,
    avartar: 'https://via.placeholder.com/40x40/3498ff/FFFFFF?text=V',
    city: 'East Alice',
    email: 'Hayley52@yahoo.com',
    firstName: 'Vladimir',
    lastName: 'Breitenberg',
    street: 'Lula Port',
    zipCode: '04635',
    date: '2016-09-26T01:25:23.057Z',
    bs: 'virtual monetize communities',
    catchPhrase: 'Mandatory user-facing methodology',
    companyName: 'Kshlerin - Pfeffer',
    words: 'eaque enim unde',
    sentence: 'Sed voluptas fugiat nihil delectus architecto et voluptatibus quis voluptas.',
    stars: 8251,
    followers: 178,
  },
  {
    id: 15,
    avartar: 'https://via.placeholder.com/40x40/3498ff/FFFFFF?text=H',
    city: 'East Frankie',
    email: 'Duane.Rempel@hotmail.com',
    firstName: 'Haylee',
    lastName: 'Purdy',
    street: 'Dena Walk',
    zipCode: '94111-0802',
    date: '2016-11-26T16:36:38.472Z',
    bs: 'enterprise drive users',
    catchPhrase: 'Customizable non-volatile paradigm',
    companyName: 'Lemke, Mitchell and Harber',
    words: 'dolores ipsum earum',
    sentence: 'Nemo molestiae ad sit cupiditate neque.',
    stars: 3099,
    followers: 707,
  },
  {
    id: 16,
    avartar: 'https://via.placeholder.com/40x40/3498ff/FFFFFF?text=H',
    city: 'New Kendall',
    email: 'Eddie_Bartell@hotmail.com',
    firstName: 'Herminia',
    lastName: 'Altenwerth',
    street: 'Kshlerin Cape',
    zipCode: '86614-9727',
    date: '2016-09-28T19:50:18.308Z',
    bs: 'cutting-edge target models',
    catchPhrase: 'Triple-buffered fault-tolerant concept',
    companyName: 'Gislason - Nicolas',
    words: 'perferendis magnam minima',
    sentence: 'Fuga in dolorem vel eligendi deserunt voluptatem.',
    stars: 8491,
    followers: 463,
  },
  {
    id: 17,
    avartar: 'https://via.placeholder.com/40x40/3498ff/FFFFFF?text=E',
    city: 'Port Whitney',
    email: 'Josephine_Legros@yahoo.com',
    firstName: 'Erick',
    lastName: 'Klein',
    street: 'Megane Cliffs',
    zipCode: '42168',
    date: '2016-04-02T05:03:42.377Z',
    bs: 'user-centric leverage experiences',
    catchPhrase: 'Centralized systematic parallelism',
    companyName: 'Olson and Sons',
    words: 'facere est in',
    sentence: 'Ducimus aliquid ut.',
    stars: 9820,
    followers: 670,
  },
  {
    id: 18,
    avartar: 'https://via.placeholder.com/40x40/3498ff/FFFFFF?text=L',
    city: 'West Meda',
    email: 'Jared.Hudson@hotmail.com',
    firstName: 'Lisandro',
    lastName: 'Barton',
    street: 'Torrance Union',
    zipCode: '19477',
    date: '2016-08-01T14:24:45.209Z',
    bs: 'open-source exploit markets',
    catchPhrase: 'Open-source impactful framework',
    companyName: 'Volkman and Sons',
    words: 'a tempore hic',
    sentence: 'Quod veniam nemo impedit mollitia.',
    stars: 1220,
    followers: 708,
  },
  {
    id: 19,
    avartar: 'https://via.placeholder.com/40x40/3498ff/FFFFFF?text=A',
    city: 'Darrenport',
    email: 'Delpha.Tromp9@yahoo.com',
    firstName: 'Ashton',
    lastName: 'Daugherty',
    street: 'Hermann Port',
    zipCode: '25133-9181',
    date: '2016-07-29T09:49:39.424Z',
    bs: 'wireless optimize deliverables',
    catchPhrase: 'Ergonomic human-resource algorithm',
    companyName: 'Grady LLC',
    words: 'libero ut repellat',
    sentence: 'Vel quod ullam.',
    stars: 420,
    followers: 30,
  },
  {
    id: 20,
    avartar: 'https://via.placeholder.com/40x40/3498ff/FFFFFF?text=C',
    city: 'Janiyahaven',
    email: 'Ariel.Maggio9@yahoo.com',
    firstName: 'Cassandra',
    lastName: 'Schmitt',
    street: 'Windler Lodge',
    zipCode: '87582-2944',
    date: '2017-01-21T12:35:27.741Z',
    bs: 'holistic cultivate relationships',
    catchPhrase: 'Enterprise-wide system-worthy data-warehouse',
    companyName: 'Ankunding Group',
    words: 'blanditiis voluptates repellat',
    sentence: 'Non quis non dignissimos sit rerum voluptatem culpa quibusdam.',
    stars: 20,
    followers: 188,
  },
];

const CompactCell = (props) => <Table.Cell {...props} style={{ padding: 4 }} />;
const CompactHeaderCell = (props) => (
  <Table.HeaderCell {...props} style={{ padding: 4, backgroundColor: '#3498ff', color: '#fff' }} />
);

export const initialState: State = { tableData: { columns: [], data: [] } };

const defaultColumns = [
  {
    key: 'id',
    label: 'Id',
    fixed: true,
    width: 70,
  },
  {
    key: 'firstName',
    label: 'First Name',
    fixed: true,
    width: 130,
  },
  {
    key: 'lastName',
    label: 'Last Name',
    width: 123,
  },
  {
    key: 'city',
    label: 'City',
    width: 200,
  },
  {
    key: 'street',
    label: 'Street',
    flexGrow: 1,
  },
];

export const ExpanderTable = () => {
  const [loading, setLoading] = React.useState(false);
  const [compact, setCompact] = React.useState(true);
  const [bordered, setBordered] = React.useState(true);
  const [noData, setNoData] = React.useState(false);
  const [showHeader, setShowHeader] = React.useState(true);
  const [autoHeight, setAutoHeight] = React.useState(false);
  const [hover, setHover] = React.useState(true);
  const [columnKeys, setColumnKeys] = React.useState(defaultColumns.map((column) => column.key));

  const columns = defaultColumns.filter((column) => columnKeys.some((key) => key === column.key));
  const CustomCell = compact ? CompactCell : Cell;
  const CustomHeaderCell = compact ? CompactHeaderCell : HeaderCell;

  return (
    <div>
      <div>
        <span>
          Compact：
          <Toggle checkedChildren="On" unCheckedChildren="Off" checked={compact} onChange={setCompact} />
        </span>

        <span>
          Bordered：
          <Toggle checkedChildren="On" unCheckedChildren="Off" checked={bordered} onChange={setBordered} />
        </span>

        <span>
          Show Header：
          <Toggle checkedChildren="On" unCheckedChildren="Off" checked={showHeader} onChange={setShowHeader} />
        </span>

        <span>
          Hover：
          <Toggle checkedChildren="On" unCheckedChildren="Off" checked={hover} onChange={setHover} />
        </span>
        <hr />
        <span>
          Loading：
          <Toggle checkedChildren="On" unCheckedChildren="Off" checked={loading} onChange={setLoading} />
        </span>

        <span>
          No data：
          <Toggle checkedChildren="On" unCheckedChildren="Off" checked={noData} onChange={setNoData} />
        </span>

        <span>
          Auto Height：
          <Toggle checkedChildren="On" unCheckedChildren="Off" checked={autoHeight} onChange={setAutoHeight} />
        </span>
      </div>
      <hr />
      Columns：
      <TagPicker
        data={defaultColumns}
        labelKey="label"
        valueKey="key"
        value={columnKeys}
        onChange={setColumnKeys}
        cleanable={false}
      />
      <hr />
      <Table
        loading={loading}
        height={300}
        hover={hover}
        showHeader={showHeader}
        autoHeight={autoHeight}
        data={noData ? [] : data}
        bordered={bordered}
        cellBordered={bordered}
        headerHeight={compact ? 30 : 40}
        rowHeight={compact ? 30 : 46}
      >
        {columns.map((column) => {
          const { key, label, ...rest } = column;
          return (
            <Column {...rest} key={key}>
              <CustomHeaderCell>{label}</CustomHeaderCell>
              <CustomCell dataKey={key} />
            </Column>
          );
        })}
      </Table>
    </div>
  );
};

const updateCallback = (data: object) => void null;

export const updateExpanderTable = (newState: State) => {
  console.log('update', newState);

  if (typeof updateCallback === 'function' && newState.tableData.data.length > 0) {
    updateCallback(newState);
  }
};
