import client1 from '../../public/images/client1.png';
import client2 from '../../public/images/client2.png';
import client3 from '../../public/images/client3.png';
import client4 from '../../public/images/client4.png';
import client5 from '../../public/images/client5.png';

export const CLIENTS = [
  { alt: 'client1', logo: client1 },
  { alt: 'client2', logo: client2 },
  { alt: 'client3', logo: client3 },
  { alt: 'client4', logo: client4 },
  { alt: 'client5', logo: client5 },
];

export const USERS = [
  {
    name: 'Alice',
    message:
      'FastNotesAI has been a game-changer for our team. With its reliable end-to-end testing, we catch bugs early, leading to faster development cycles and improved collaboration.',
  },
  {
    name: 'Bob',
    message:
      "I used to spend hours debugging frontend issues, but FastNotesAI simplified everything. Now, I'm more productive, and my colleagues can trust our code thanks to FastNotesAI.",
  },
  {
    name: 'Charlie',
    message:
      "FastNotesAI has transformed the way we work. Our QA and development teams are on the same page, and our productivity has skyrocketed. It's a must-have tool.",
  },
  {
    name: 'David',
    message:
      'I was skeptical at first, but FastNotesAI exceeded my expectations. Our project timelines have improved, and collaboration between teams is seamless.',
  },
  {
    name: 'Ella',
    message:
      "FastNotesAI made writing and running tests a breeze. Our team's productivity has never been higher, and we're delivering more reliable software.",
  },
  {
    name: 'Frank',
    message:
      "Thanks to FastNotesAI, we've eliminated testing bottlenecks. Our developers and testers collaborate effortlessly, resulting in quicker releases.",
  },
  {
    name: 'Grace',
    message:
      'FastNotesAI has improved our development process significantly. We now have more time for innovation, and our products are of higher quality.',
  },
  {
    name: 'Hank',
    message:
      "FastNotesAI's user-friendly interface made it easy for our non-technical team members to contribute to testing. Our workflow is much more efficient now.",
  },
  {
    name: 'Ivy',
    message:
      "Our team's collaboration improved immensely with FastNotesAI. We catch issues early, leading to less friction and quicker feature deployments.",
  },
  {
    name: 'Jack',
    message:
      "FastNotesAI's robust testing capabilities have elevated our development standards. We work more harmoniously, and our releases are more reliable.",
  },
  {
    name: 'Katherine',
    message:
      "FastNotesAI is a lifesaver for our cross-functional teams. We're more productive, and there's a shared sense of responsibility for product quality.",
  },
  {
    name: 'Liam',
    message:
      "FastNotesAI has helped us maintain high standards of quality. Our team's collaboration has improved, resulting in faster development cycles.",
  },
  {
    name: 'Mia',
    message:
      "FastNotesAI is a powerful tool that improved our productivity and collaboration. It's now an integral part of our development process.",
  },
  {
    name: 'Nathan',
    message:
      "FastNotesAI's user-friendly interface and detailed reporting have made testing a breeze. Our team's productivity is at an all-time high.",
  },
  {
    name: 'Olivia',
    message:
      "We saw immediate benefits in terms of productivity and collaboration after adopting FastNotesAI. It's an essential tool for our development workflow.",
  },
  {
    name: 'Paul',
    message:
      "FastNotesAI has streamlined our testing process and brought our teams closer. We're more efficient and deliver better results.",
  },
  {
    name: 'Quinn',
    message:
      'FastNotesAI has been a game-changer for us. Our productivity and collaboration have improved significantly, leading to better software.',
  },
  {
    name: 'Rachel',
    message:
      'Thanks to FastNotesAI, our testing process is now a seamless part of our development cycle. Our teams collaborate effortlessly.',
  },
  {
    name: 'Sam',
    message:
      'FastNotesAI is a fantastic tool that has revolutionized our workflow. Our productivity and collaboration have reached new heights.',
  },
];

export const PRICING_CARDS = [
  {
    planType: 'Free Plan',
    price: '0',
    description: 'Limited block trials  for teams',
    highlightFeature: '',
    freatures: [
      'Unlimited blocks for teams',
      'Unlimited file uploads',
      '30 day page history',
      'Invite 2 guests',
    ],
  },
  {
    planType: 'Pro Plan',
    price: '12.99',
    description: 'Billed annually. $17 billed monthly',
    highlightFeature: 'Everything in free +',
    freatures: [
      'Unlimited blocks for teams',
      'Unlimited file uploads',
      '1 year day page history',
      'Invite 10 guests',
    ],
  },
];

//probably render the subscriptions directly from supabase, not manually
export const PRICING_PLANS = { proplan: 'Pro Plan', freeplan: 'Free Plan' };

export const MAX_FOLDERS_FREE_PLAN = 3;