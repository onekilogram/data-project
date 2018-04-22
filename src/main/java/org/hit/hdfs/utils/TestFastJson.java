package org.hit.hdfs.utils;

import java.io.StringReader;

import com.alibaba.fastjson.JSONReader;
/* 
 * 这里将json的转化和解析都放在一起了，大家可以根据实际需要来转化json字符串和解析json字符串 
 */
public class TestFastJson {

	static class PersonFather {
		// private int id;
		private Person person;

		// public PersonFather(int id, Person person) {
		// super();
		// this.id = id;
		// this.person = person;
		// }
		//
		// public int getId() {
		// return id;
		// }
		//
		// public void setId(int id) {
		// this.id = id;
		// }

		public Person getPerson() {
			return person;
		}

		public PersonFather(Person person) {
			super();
			this.person = person;
		}

		public void setPerson(Person person) {
			this.person = person;
		}

		// @Override
		// public String toString() {
		// return "PersonFather [id=" + id + ", person=" + person + "]";
		// }
	}

	static class Person {
		private String id;
		private String name;
		private int age;

		public Person() {

		}

		public Person(String id, String name, int age) {
			this.id = id;
			this.name = name;
			this.age = age;
		}

		public String getId() {
			return id;
		}

		public void setId(String id) {
			this.id = id;
		}

		public String getName() {
			return name;
		}

		public void setName(String name) {
			this.name = name;
		}

		public int getAge() {
			return age;
		}

		public void setAge(int age) {
			this.age = age;
		}

		@Override
		public String toString() {
			return "Person [age=" + age + ", id=" + id + ", name=" + name + "]";
		}

	}

	public static void main(String[] args) {
		

		//String string = JSON.toJSONString(list);
		//===========================================================
		//===========================================================
		// {person1:{name:fastjson,id:1,age:1},person1:{name:fastjson,id:1,age:1}}
		String string = "{\"person1\":{\"name\":\"fastjson\",\"id\":\"1\",\"age\":1},\"person2\":{\"name\":\"fastjson\",\"id\":\"1\",\"age\":1}}";
		//String string = "[{\"perso2n\":{\"name\":\"fastjson\",\"id\":\"1\",\"age\":1}},{\"person\":{\"name\":\"fastjson\",\"id\":\"1\",\"age\":1}}]";

		JSONReader reader = null;
		reader = new JSONReader(new StringReader(string));
		reader.startObject();
		System.out.println("==============================");
		while (reader.hasNext()) {
			String key = reader.readString();
			System.out.println(key);
			Person vo = reader.readObject(Person.class);
			//String key2 = reader.readString();
			System.out.println(vo);
			// handle vo ...
		}
		reader.endObject();
		reader.close();

	}
}