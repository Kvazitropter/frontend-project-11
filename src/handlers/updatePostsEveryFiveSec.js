import { differenceBy } from 'lodash';
import getData from './getData.js';
import parseData from './parseData';

const updatePostsEveryFiveSec = (prevLinks, link) => {
  getData(link)
    .then((data) => {
      const [, newPosts] = parseData(data);
      const newLinks = differenceBy(newPosts, prevLinks);
      prevLinks.push(...newLinks);
      setTimeout(updatePostsEveryFiveSec, 5000, prevLinks, link);
    });
};

export default updatePostsEveryFiveSec;
