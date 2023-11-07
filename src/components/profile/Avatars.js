import av_0 from '../../img/avatars/av_0.svg'
import av_1 from '../../img/avatars/av_1.svg'
import av_2 from '../../img/avatars/av_2.svg'
import av_3 from '../../img/avatars/av_3.svg'
import av_4 from '../../img/avatars/av_4.svg'
import av_5 from '../../img/avatars/av_5.svg'
import av_6 from '../../img/avatars/av_6.svg'
import av_7 from '../../img/avatars/av_7.svg'
import av_8 from '../../img/avatars/av_8.svg'
import av_9 from '../../img/avatars/av_9.svg'
import av_10 from '../../img/avatars/av_10.svg'
import av_11 from '../../img/avatars/av_11.svg'
import av_12 from '../../img/avatars/av_12.svg'
import av_13 from '../../img/avatars/av_13.svg'
import av_14 from '../../img/avatars/av_14.svg'

class Avatars {
    static avatars = [av_0, av_1, av_2, av_3, av_4, av_5, av_6, av_7, av_8, av_9, av_10, av_11, av_12, av_13, av_14]

    static get(idx) {
        return Avatars.avatars[idx]
    }

    static has(idx) {
        return idx > 0 && idx < Avatars.avatars.length
    }

    static count() {
        return Avatars.avatars.length
    }
}

export default Avatars;
